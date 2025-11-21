import { ref, readonly, type Ref } from 'vue'
import { Message, MessageType } from '@/generated/message.js'

// Event keys can be either a numeric MessageType or custom string like "connected"
type EventKey = MessageType | string
type Listener = (payload?: unknown) => void

// Singleton shared state
const _ws: Ref<WebSocket | null> = ref(null)
const _listeners: Ref<Map<EventKey, Set<Listener>>> = ref(new Map())
const _isConnected: Ref<boolean> = ref(false)
const _currentUrl: Ref<string | null> = ref(null)
const _isConnecting: Ref<boolean> = ref(false)

// Auto-reconnect state
const _shouldReconnect: Ref<boolean> = ref(true)
const _reconnectAttempts: Ref<number> = ref(0)
const _reconnectTimer: Ref<number | null> = ref(null)

// Reconnect policy
const RECONNECT_BASE_MS = 500
const RECONNECT_MAX_MS = 30_000

function _emit(eventType: EventKey, payload?: unknown) {
	const set = _listeners.value.get(eventType)
	if (!set) return
	for (const cb of Array.from(set)) {
		try {
			cb(payload)
		} catch (err) {
			console.error('WebSocket listener error:', err)
		}
	}
}

function _clearReconnectTimer() {
	if (_reconnectTimer.value != null) {
		try { window.clearTimeout(_reconnectTimer.value) } catch (_) { /* noop */ }
		_reconnectTimer.value = null
	}
}

function _scheduleReconnect() {
	if (!_shouldReconnect.value || !_currentUrl.value) return
	if (_isConnected.value || _isConnecting.value) return

	_reconnectAttempts.value += 1
	const base = Math.min(RECONNECT_BASE_MS * Math.pow(2, _reconnectAttempts.value - 1), RECONNECT_MAX_MS)
	const jitter = Math.floor(Math.random() * Math.min(1000, base))
	const delay = Math.max(250, base + jitter)

	console.log(`WebSocket reconnect #${_reconnectAttempts.value} in ${delay}ms`)
	_clearReconnectTimer()
	_reconnectTimer.value = window.setTimeout(() => {
		if (!_shouldReconnect.value || _isConnected.value || _isConnecting.value || !_currentUrl.value) return
		_openSocket(_currentUrl.value)
	}, delay)
}

function _attachSocketHandlers() {
	if (!_ws.value) return

	_ws.value.onopen = () => {
		_isConnected.value = true
		_isConnecting.value = false
		_reconnectAttempts.value = 0
		_clearReconnectTimer()
		console.log('WebSocket connected')
		_emit('connected')
	}

	_ws.value.onmessage = async (ev: MessageEvent) => {
    console.log('WebSocket message received');
		try {
			let bytes: Uint8Array
			if (ev.data instanceof ArrayBuffer) {
				bytes = new Uint8Array(ev.data)
			} else if (ev.data instanceof Blob && typeof ev.data.arrayBuffer === 'function') {
				const buf = await ev.data.arrayBuffer()
				bytes = new Uint8Array(buf)
			} else if (ev.data instanceof Uint8Array) {
				bytes = ev.data
			} else if (typeof ev.data === 'string') {
				bytes = new TextEncoder().encode(ev.data)
			} else if (typeof (ev.data as any).arrayBuffer === 'function') {
				const buf = await (ev.data as { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer()
				bytes = new Uint8Array(buf)
			} else {
				console.warn('Unsupported WebSocket message type', typeof ev.data)
				return
			}

			const msg = Message.decode(bytes)
			_emit(msg.type as MessageType, msg)
		} catch (err) {
			console.error('Error decoding WebSocket message:', err)
		}
	}

	_ws.value.onclose = () => {
		console.log('WebSocket disconnected')
		_isConnected.value = false
		_isConnecting.value = false
		_emit('disconnected')
		_scheduleReconnect()
	}

	_ws.value.onerror = (error) => {
		console.error('WebSocket error:', error)
		_isConnected.value = false
		_isConnecting.value = false
		_emit('error', error)
		_scheduleReconnect()
	}
}

function _openSocket(url: string) {
	_currentUrl.value = url
	if (_ws.value && _ws.value.readyState === WebSocket.OPEN) return
	if (_isConnecting.value) return

	_isConnecting.value = true
	try {
		_ws.value = new WebSocket(url)
		_attachSocketHandlers()
	} catch (err) {
		console.error('WebSocket creation failed:', err)
		_isConnecting.value = false
		_scheduleReconnect()
	}
}

export interface UseWebsocket {
	ws: Readonly<Ref<WebSocket | null>>
	isConnected: Readonly<Ref<boolean>>
	connect: (url?: string) => void
	disconnect: () => void
	send: (message: Message) => Promise<void>
	on: (event: EventKey, cb: Listener) => () => void
	off: (event: EventKey, cb: Listener) => void
}

export function initWebsocket(url: string): UseWebsocket {
	_shouldReconnect.value = true
	_reconnectAttempts.value = 0
	_clearReconnectTimer()
	_openSocket(url)
	return useWebsocket()
}

export function useWebsocket(): UseWebsocket {
	function connect(url?: string) {
		if (url) {
			_shouldReconnect.value = true
			_reconnectAttempts.value = 0
			_clearReconnectTimer()
			_openSocket(url)
			return
		}
		if (_currentUrl.value) {
			_shouldReconnect.value = true
			_reconnectAttempts.value = 0
			_clearReconnectTimer()
			_openSocket(_currentUrl.value)
		} else {
			console.warn('useWebsocket.connect: URL is required on first call')
		}
	}

	function disconnect() {
		_shouldReconnect.value = false
		_clearReconnectTimer()
		if (_ws.value) {
			try { _ws.value.close() } catch (_) { /* noop */ }
			_ws.value = null
		}
		_isConnected.value = false
		_isConnecting.value = false
	}

	async function send(message: Message) {
		if (!_ws.value || _ws.value.readyState !== WebSocket.OPEN) {
			console.warn('WebSocket is not connected')
			return
		}
		try {
			const bytes = Message.encode(message).finish()
			_ws.value.send(bytes)
		} catch (err) {
			console.error('Failed to send WebSocket message:', err)
		}
	}

	function on(event: EventKey, cb: Listener) {
		if (!_listeners.value.has(event)) {
			_listeners.value.set(event, new Set())
		}
		_listeners.value.get(event)!.add(cb)
		return () => off(event, cb)
	}

	function off(event: EventKey, cb: Listener) {
		const set = _listeners.value.get(event)
		if (!set) return
		set.delete(cb)
		if (set.size === 0) {
			_listeners.value.delete(event)
		}
	}

	return {
		ws: readonly(_ws),
		isConnected: readonly(_isConnected),
		connect,
		disconnect,
		send,
		on,
		off,
	}
}
