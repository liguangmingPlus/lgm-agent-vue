/**
 * Agent WebSocket API
 */

const WS_URL = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws/agent`

export class AgentWebSocket {
  constructor() {
    this.ws = null
    this.sessionId = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.listeners = new Map()
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      this.ws = new WebSocket(WS_URL)

      this.ws.onopen = () => {
        console.log('[AgentWS] Connected')
        this.reconnectAttempts = 0
        resolve()
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (e) {
          console.error('[AgentWS] Parse error:', e)
        }
      }

      this.ws.onerror = (error) => {
        console.error('[AgentWS] Error:', error)
        this.emit('error', { message: '连接错误' })
        reject(error)
      }

      this.ws.onclose = () => {
        console.log('[AgentWS] Disconnected')
        this.emit('disconnected')
      }
    })
  }

  handleMessage(data) {
    switch (data.type) {
      case 'connected':
        this.sessionId = data.sessionId
        this.emit('connected', { sessionId: data.sessionId })
        break
      case 'token':
        this.emit('token', { content: data.content })
        break
      case 'done':
        this.emit('done', { sessionId: data.sessionId })
        break
      case 'error':
        this.emit('error', { message: data.message })
        break
      default:
        console.warn('[AgentWS] Unknown message type:', data.type)
    }
  }

  send(message, model = 'deepseek') {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('[AgentWS] Not connected')
      return false
    }

    const payload = {
      type: 'chat',
      message,
      model,
      sessionId: this.sessionId
    }

    this.ws.send(JSON.stringify(payload))
    return true
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return
    const callbacks = this.listeners.get(event)
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return
    this.listeners.get(event).forEach(cb => cb(data))
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.sessionId = null
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

export function createAgentWebSocket() {
  return new AgentWebSocket()
}
