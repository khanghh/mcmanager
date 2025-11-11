import { ref, readonly } from 'vue'
import { Message } from '@/generated/message.js'

// Singleton state shared across all consumers
const _ws = ref(null)
const _listeners = ref(new Map())
const _isConnected = ref(false)
const _currentUrl = ref(null)
const _isConnecting = ref(false)

function _emit(eventType, payload) {
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

  _ws.value.onmessage = async (ev) => {
    try {
      const data = await ev.data.arrayBuffer()
      const msg = Message.decode(new Uint8Array(data))
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

export function initWebsocket(url) {
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

export function useWebsocket() {
  function connect(url) {
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

  function send(message) {
    if (_ws.value && _ws.value.readyState === WebSocket.OPEN) {
      _ws.value.send(Message.encode(message).finish())
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  function on(messageType, callback) {
    if (!_listeners.value.has(messageType)) {
      _listeners.value.set(messageType, new Set())
    }
    _listeners.value.get(messageType).add(callback)
    return () => off(messageType, callback)
  }

  function off(messageType, callback) {
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
