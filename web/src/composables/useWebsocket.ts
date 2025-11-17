import { ref, readonly, type Ref } from 'vue'
// We'll dynamically import the generated message runtime to avoid pulling in the generated
// `.d.ts` file (which depends on protobuf / long typings that aren't installed in this project).
const messageModulePromise = import('../generated/message.js') as Promise<any>

// Singleton state shared across all consumers
type EventKey = string | number
type Listener = (payload?: any) => void

const _ws: Ref<WebSocket | null> = ref(null)
const _listeners: Ref<Map<EventKey, Set<Listener>>> = ref(new Map())
const _isConnected: Ref<boolean> = ref(false)
const _currentUrl: Ref<string | null> = ref(null)
const _isConnecting: Ref<boolean> = ref(false)

function _emit(eventType: EventKey, payload?: any) {
  const set = _listeners.value.get(eventType)
  if (set) {
    // Copy to array to avoid mutation during iteration
    Array.from(set).forEach(cb => {
      try { cb(payload) } catch (e) { console.error('WebSocket listener error:', e) }
    })
  }
}

function _attachSocketHandlers() {
  if (!_ws.value) return
  _ws.value.onopen = () => {
    _isConnected.value = true
    _isConnecting.value = false
    console.log('WebSocket connected')
    _emit('connected')
  }

  _ws.value.onmessage = async (ev: MessageEvent) => {
    try {
      let bytes: Uint8Array
      if (ev.data instanceof ArrayBuffer) {
        bytes = new Uint8Array(ev.data)
      } else if (ev.data instanceof Blob && typeof ev.data.arrayBuffer === 'function') {
        const buffer = await ev.data.arrayBuffer()
        bytes = new Uint8Array(buffer)
      } else if (typeof (ev.data as any).arrayBuffer === 'function') {
        const buffer = await (ev.data as any).arrayBuffer()
        bytes = new Uint8Array(buffer)
      } else {
        // Fallback: try to coerce to Uint8Array (may be string or already Uint8Array)
        if (ev.data instanceof Uint8Array) {
          bytes = ev.data
        } else if (typeof ev.data === 'string') {
          bytes = new TextEncoder().encode(ev.data)
        } else {
          console.error('Unsupported WebSocket message type', typeof ev.data)
          return
        }
      }
  const mod = await messageModulePromise
  const msg = mod.Message.decode(bytes)
  _emit(msg.type, msg)
    } catch (error) {
      console.error('Error decoding WebSocket message:', error)
    }
  }

  _ws.value.onclose = () => {
    console.log('WebSocket disconnected')
    _isConnected.value = false
    _isConnecting.value = false
    _emit('disconnected')
  }

  _ws.value.onerror = (error) => {
    console.error('WebSocket error:', error)
    _isConnected.value = false
    _isConnecting.value = false
    _emit('error', error)
  }
}

export interface UseWebsocket {
  ws: Readonly<Ref<WebSocket | null>>;
  isConnected: Readonly<Ref<boolean>>;
  connect: (url?: string) => void;
  disconnect: () => void;
  send: (message: any) => Promise<void>;
  on: (messageType: EventKey, callback: Listener) => () => void;
  off: (messageType: EventKey, callback: Listener) => void;
}

export function initWebsocket(url?: string): UseWebsocket {
  if (!url) {
    console.warn('initWebsocket: URL is required')
    return useWebsocket()
  }
  // Set URL if first time or changed
  _currentUrl.value = url
  // Connect only once
  if (_ws.value && _ws.value.readyState === WebSocket.OPEN) return useWebsocket()
  if (_isConnecting.value) return useWebsocket()
  _isConnecting.value = true
  _ws.value = new WebSocket(_currentUrl.value)
  _attachSocketHandlers()
  return useWebsocket()
}

export function useWebsocket(): UseWebsocket {
  function connect(url?: string) {
    if (url) _currentUrl.value = url
    if (!_currentUrl.value) {
      console.warn('No WebSocket URL provided')
      return
    }
    if (_ws.value && _ws.value.readyState === WebSocket.OPEN) return
    if (_isConnecting.value) return
    _isConnecting.value = true
    _ws.value = new WebSocket(_currentUrl.value)
    _attachSocketHandlers()
  }

  function disconnect() {
    if (_ws.value) {
      _ws.value.close()
      _ws.value = null
      _isConnected.value = false
      _isConnecting.value = false
    }
  }

  async function send(message: any) {
    if (_ws.value && _ws.value.readyState === WebSocket.OPEN) {
      const mod = await messageModulePromise
      _ws.value.send(mod.Message.encode(message as any).finish())
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  function on(messageType: EventKey, callback: Listener) {
    if (!_listeners.value.has(messageType)) {
      _listeners.value.set(messageType, new Set())
    }
    _listeners.value.get(messageType)!.add(callback)
    return () => off(messageType, callback)
  }

  function off(messageType: EventKey, callback: Listener) {
    const set = _listeners.value.get(messageType)
    if (set) {
      set.delete(callback)
      if (set.size === 0) _listeners.value.delete(messageType)
    }
  }

  return {
    ws: readonly(_ws),
    isConnected: readonly(_isConnected),
    connect,
    disconnect,
    send,
    on,
    off
  }
}
