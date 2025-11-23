import { ref, readonly, type Ref } from 'vue'
import { Message } from '@/generated/message.js'

// Singleton shared state
const _ws: Ref<WebSocket | null> = ref(null)
const _isConnected: Ref<boolean> = ref(false)
const _currentUrl: Ref<string | null> = ref(null)
const _isConnecting: Ref<boolean> = ref(false)

// Auto-reconnect state
const _shouldReconnect: Ref<boolean> = ref(true)
const _reconnectAttempts: Ref<number> = ref(0)
const _reconnectTimer: Ref<number | null> = ref(null)

// Listeners
type Listener = () => void
const _onOpenListeners: Set<Listener> = new Set()
const _onCloseListeners: Set<Listener> = new Set()
const _onMessageListeners: Set<(msg: Message) => void> = new Set()

// Reconnect policy
const RECONNECT_BASE_MS = 500
const RECONNECT_MAX_MS = 30_000

function _emitOpen() {
  for (const cb of _onOpenListeners) {
    try { cb() } catch (e) { console.error(e) }
  }
}

function _emitClose() {
  for (const cb of _onCloseListeners) {
    try { cb() } catch (e) { console.error(e) }
  }
}

function _emitMessage(msg: Message) {
  for (const cb of _onMessageListeners) {
    try { cb(msg) } catch (e) { console.error(e) }
  }
}

function _clearReconnectTimer() {
  if (_reconnectTimer.value != null) {
    try { window.clearTimeout(_reconnectTimer.value) } catch { /* noop */ }
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
    _emitOpen()
  }

  _ws.value.onmessage = async (ev: MessageEvent) => {
    console.log('WebSocket message received');
    try {
      let bytes: Uint8Array
      if (typeof ev.data === 'string') {
        bytes = new TextEncoder().encode(ev.data)
      } else if (ev.data instanceof Blob) {
        bytes = new Uint8Array(await ev.data.arrayBuffer())
      } else if (ev.data instanceof ArrayBuffer) {
        bytes = new Uint8Array(ev.data)
      } else {
        console.warn('Unsupported WebSocket message type', typeof ev.data)
        return
      }

      const msg = Message.decode(bytes)
      _emitMessage(msg)
    } catch (err) {
      console.error('Error decoding WebSocket message:', err)
    }
  }

  _ws.value.onclose = () => {
    console.log('WebSocket disconnected')
    _isConnected.value = false
    _isConnecting.value = false
    _emitClose()
    _scheduleReconnect()
  }

  _ws.value.onerror = (error) => {
    console.error('WebSocket error:', error)
    _isConnected.value = false
    _isConnecting.value = false
    _emitClose() // Treat error as close/disconnect for listeners
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
  send: (message: Message) => Promise<void>
  onopen: (cb: () => void) => void
  onclose: (cb: () => void) => void
  onmessage: (cb: (msg: Message) => void) => void
  close: () => void
}

export function initWebsocket(url: string): UseWebsocket {
  _shouldReconnect.value = true
  _reconnectAttempts.value = 0
  _clearReconnectTimer()
  _openSocket(url)
  return useWebsocket()
}

export function useWebsocket(): UseWebsocket {

  function close() {
    _shouldReconnect.value = false
    _clearReconnectTimer()
    if (_ws.value) {
      try { _ws.value.close() } catch { /* noop */ }
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

  function onopen(cb: () => void) {
    _onOpenListeners.add(cb)
    // If already connected, fire immediately
    if (_isConnected.value) {
      try { cb() } catch (e) { console.error(e) }
    }
  }

  function onclose(cb: () => void) {
    _onCloseListeners.add(cb)
  }

  function onmessage(cb: (msg: Message) => void) {
    _onMessageListeners.add(cb)
  }

  return {
    ws: readonly(_ws),
    isConnected: readonly(_isConnected),
    send,
    onopen,
    onclose,
    onmessage,
    close,
  }
}
