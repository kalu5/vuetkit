import type { MaybeRefOrGetter, Ref } from 'vue'

import type { EventCallback } from './socket-client'
import { onMounted, onUnmounted, ref, shallowRef, toValue } from 'vue'
import WebSocketClient from './socket-client'

// socket connection status (aligned with WebSocket.readyState)
export enum SocketStatus {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

// reconnect configuration
export interface SocketReconnectOptions {
  // max retry count
  maxRetries?: number
  // retry interval in ms
  retryInterval?: number
  // whether to use exponential backoff
  exponentialBackoff?: boolean
}

// heartbeat configuration
export interface SocketHeartbeatOptions {
  // heartbeat interval in ms
  interval?: number
  // heartbeat timeout in ms
  timeout?: number
  // ping message content
  pingMessage?: string | Record<string, any>
  // pong message content (used to match heartbeat response)
  pongMessage?: Record<string, any>
}

// socket options
export interface SocketOptions {
  // whether to connect automatically on mount (default: true)
  autoConnect?: boolean
  // WebSocket sub-protocols
  protocols?: string | string[]
  // reconnect configuration
  reconnect?: SocketReconnectOptions
  // heartbeat configuration
  heartbeat?: SocketHeartbeatOptions
  // called when the connection opens
  onOpen?: () => void
  // called when the connection closes
  onClose?: () => void
  // called when an error occurs
  onError?: (error: any) => void
  // called when a message is received
  onMessage?: (data: any) => void
}

// socket return value
export interface SocketReturn {
  // underlying WebSocket client instance
  client: Ref<WebSocketClient | null>
  // current connection status
  status: Ref<SocketStatus>
  // latest received message
  data: Ref<any>
  // latest error
  error: Ref<unknown>
  // connect to the WebSocket server
  connect: () => void
  // disconnect from the WebSocket server
  disconnect: () => void
  // reconnect to the WebSocket server
  reconnect: () => void
  // send a message to the server
  send: (data: string | object) => void
  // subscribe to messages of a specific type
  on: (type: number, callback: EventCallback) => void
  // unsubscribe from messages of a specific type
  off: (type: number, callback: EventCallback) => void
}

/**
 * useSocket
 * @description A composable for managing WebSocket connections with auto-reconnection, heartbeat, and message-type-based subscriptions.
 */
export function useSocket(
  url: MaybeRefOrGetter<string>,
  options?: SocketOptions,
): SocketReturn {
  const {
    autoConnect = true,
    protocols,
    reconnect: reconnectOptions,
    heartbeat: heartbeatOptions,
    onOpen,
    onClose,
    onError,
    onMessage,
  } = options || {}

  const client = shallowRef<WebSocketClient | null>(null)
  const status = ref<SocketStatus>(SocketStatus.CLOSED)
  const data = shallowRef<any>(null)
  const error = ref<unknown>()

  // subscriptions per message type (key = msg.body.type)
  const typeListeners = new Map<number, Set<EventCallback>>()

  function resolveUrl(): string {
    return toValue(url)
  }

  function handleOpen() {
    status.value = SocketStatus.OPEN
    onOpen?.()
  }

  function handleClose() {
    status.value = SocketStatus.CLOSED
    onClose?.()
  }

  function handleError(err: any) {
    error.value = err
    onError?.(err)
  }

  function handleMessage(msg: any) {
    data.value = msg
    // dispatch to type-specific subscribers
    const type = msg?.body?.type
    if (type != null) {
      typeListeners.get(type)?.forEach(cb => cb(msg))
    }
    onMessage?.(msg)
  }

  function setupListeners(ws: WebSocketClient) {
    ws.on('open', handleOpen)
    ws.on('close', handleClose)
    ws.on('error', handleError)
    ws.on('message', handleMessage)
  }

  function teardownListeners(ws: WebSocketClient) {
    ws.off('open', handleOpen)
    ws.off('close', handleClose)
    ws.off('error', handleError)
    ws.off('message', handleMessage)
  }

  // connect to the WebSocket server
  function connect() {
    // already connected or connecting
    if (client.value) {
      return
    }
    const ws = new WebSocketClient(resolveUrl(), {
      protocols,
      reconnect: reconnectOptions,
      heartbeat: heartbeatOptions,
    })
    setupListeners(ws)
    status.value = SocketStatus.CONNECTING
    ws.connect()
    client.value = ws
  }

  // disconnect from the WebSocket server
  function disconnect() {
    if (client.value) {
      teardownListeners(client.value)
      client.value.disconnect()
      client.value = null
    }
    status.value = SocketStatus.CLOSED
    typeListeners.clear()
  }

  // reconnect to the WebSocket server
  function reconnect() {
    if (client.value) {
      client.value.reconnect()
    }
    else {
      connect()
    }
  }

  // send a message to the server
  function send(msg: string | object) {
    client.value?.send(msg)
  }

  // subscribe to messages of a specific type
  function on(type: number, callback: EventCallback) {
    if (!typeListeners.has(type)) {
      typeListeners.set(type, new Set())
    }
    typeListeners.get(type)?.add(callback)
  }

  // unsubscribe from messages of a specific type
  function off(type: number, callback: EventCallback) {
    typeListeners.get(type)?.delete(callback)
  }

  onMounted(() => {
    if (autoConnect) {
      connect()
    }
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    client,
    status,
    data,
    error,
    connect,
    disconnect,
    reconnect,
    send,
    on,
    off,
  }
}
