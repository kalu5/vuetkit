// socket connection type
export enum ESocketType {
  // heartbeat
  HEART_BEAT,
  // online
  ONLINE,
  // unread message
  UNREAD_MESSAGE,
  // message notification
  MESSAGE_NOTIFICATION,
  // error
  ERROR = -1,
}

// message content
export interface ISocketMessageItem {
  type?: number
  operatorType?: number
  body?: {
    msg?: string
    type?: number
    count?: number
    users?: {
      id: number
      name: string
      previewUrl: string
    }[]
  }
}

type WebSocketEventType = 'open' | 'close' | 'error' | 'message'

// websocket close code
enum EWebSockCloseCode {
  timeout = 4000,
}

// reconnect options
interface ReconnectOptions {
  // max retry count
  maxRetries?: number
  // retry interval (ms)
  retryInterval?: number
  exponentialBackoff?: boolean
}

// heartbeat options
interface HeartbeatOptions {
  interval?: number
  timeout?: number
  pingMessage?: string | Record<string, any>
  pongMessage?: Record<string, any>
}

// client options
interface WebSocketClientOptions {
  // protocols
  protocols?: string | string[]
  // reconnect options
  reconnect?: ReconnectOptions
  // heartbeat options
  heartbeat?: HeartbeatOptions
  // auto connect
  autoConnect?: boolean
}

export type EventCallback = (data: any) => void

export default class WebSocketClient {
  private ws: WebSocket | null = null
  private readonly url: string
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private heartTimeout: NodeJS.Timeout | null = null
  private eventListeners: Map<WebSocketEventType, Set<EventCallback>> = new Map()

  private readonly options: WebSocketClientOptions
  private reconnectAttempts = 0
  private waitForPong = false

  constructor(url: string, options: WebSocketClientOptions) {
    this.url = url
    this.options = options
  }

  // socket connect
  public connect(): void {
    if (this.ws && [WebSocket.CONNECTING, WebSocket.OPEN].includes(this.ws.readyState as 0 | 1)) {
      return
    }
    try {
      this.ws = this.options.protocols
        ? new WebSocket(this.url, this.options.protocols)
        : new WebSocket(this.url)
      this.setupEventListeners()
    }
    catch {
      this.reconnect()
    }
  }

  // setup event listeners
  private setupEventListeners(): void {
    if (!this.ws)
      return

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.emit('open', null)
    }

    this.ws.onclose = () => {
      this.emit('close', null)
    }

    this.ws.onerror = (error) => {
      this.emit('error', error)
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const {
          body: { msg, type },
        } = data || {}
        // connection error
        if (type === ESocketType.ERROR) {
          this.emit('error', new Error(msg))
          this.stopHeartbeat()
          return
        }
        // heartbeat response handling
        if (this.options.heartbeat?.pongMessage) {
          const { type: pongType, msg: pongMsg } = this.options.heartbeat.pongMessage
          if (type === pongType && msg === pongMsg) {
            this.waitForPong = false
            return
          }
        }
        this.emit('message', data)
      }
      catch (error) {
        this.emit('error', error)
      }
    }
  }

  // reconnect
  public reconnect(): void {
    if (!this.options.reconnect)
      return

    this.stopReconnect()

    const {
      maxRetries = 3,
      retryInterval = 3000,
      exponentialBackoff = true,
    } = this.options.reconnect
    if (this.reconnectAttempts < maxRetries) {
      const delay = exponentialBackoff
        ? retryInterval * 2 ** this.reconnectAttempts
        : retryInterval

      this.reconnectTimer = setTimeout(() => {
        this.reconnectAttempts = this.reconnectAttempts + 1
        this.connect()
      }, delay)
    }
  }

  // start heartbeat
  private startHeartbeat(): void {
    if (!this.options.heartbeat)
      return

    const {
      interval = 30000,
      timeout = 5000,
      pingMessage = {
        type: 0,
        operatorType: 0,
        str: 'ping',
      },
    } = this.options.heartbeat

    this.stopHeartbeat()

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.waitForPong = true
        this.send(pingMessage)
        this.stopHeartbeatTimeout()
        this.heartTimeout = setTimeout(() => {
          // disconnect on heartbeat timeout
          if (this.waitForPong) {
            this.ws?.close(EWebSockCloseCode.timeout, 'Heartbeat timeout')
            // onClose will not fire in this case, so emit error directly
            // let user retry manually after heartbeat timeout
            this.emit('error', new Error('Heartbeat timeout, please retry'))
            this.stopHeartbeat()
          }
        }, timeout)
      }
    }, interval)
  }

  // stop reconnect
  private stopReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  // stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    this.stopHeartbeatTimeout()
  }

  // stop heartbeat timeout check
  private stopHeartbeatTimeout(): void {
    if (this.heartTimeout) {
      clearTimeout(this.heartTimeout)
      this.heartTimeout = null
    }
  }

  // send message
  public send(data: string | object): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data)
    this.ws.send(message)
  }

  // register event listener
  public on(event: WebSocketEventType, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)?.add(callback)
  }

  // remove event listener
  public off(event: WebSocketEventType, callback: EventCallback): void {
    this.eventListeners.get(event)?.delete(callback)
  }

  // emit event to listeners
  private emit(event: WebSocketEventType, data: any): void {
    this.eventListeners.get(event)?.forEach(callback => callback(data))
  }

  // disconnect
  public disconnect(type = 'normal'): void {
    this.reconnectAttempts = 0
    this.stopHeartbeat()
    this.stopReconnect()
    // clear listeners on normal disconnect, keep them on retry disconnect
    if (type === 'normal') {
      this.eventListeners.clear()
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
