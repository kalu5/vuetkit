# useSocket

管理 WebSocket 连接，支持自动重连、心跳和基于消息类型的订阅。

::: tip :zap:特性

1. 挂载时自动连接，卸载时自动断开。
2. 内置指数退避重连机制。
3. 内置 ping/pong 心跳和超时检测。
4. 通过 `body.type` 订阅消息，或通过 `onMessage` 接收所有消息。
5. 管理 `status`、`data` 和 `error` 状态。
   :::

## 基础用法

```ts
import { useSocket } from '@vuecraft/core'

const { status, data, send, on, connect, disconnect } = useSocket('wss://example.com/ws')

// subscribe to messages of a specific type
on(2, (msg) => {
  console.log('unread count:', msg.body.count)
})
```

## 更多示例

### 手动连接

默认情况下，连接会在挂载后立即开启。
你可以将 `autoConnect` 设置为 `false`，然后调用 `connect` 来手动触发连接。

```ts
import { useSocket } from '@vuecraft/core'
import { onMounted } from 'vue'

const { status, connect } = useSocket('wss://example.com/ws', {
  autoConnect: false,
})

onMounted(() => {
  connect()
})
```

### 动态 URL

`url` 参数接受 `string`、`ref` 或 getter 函数，因此你可以动态构建 URL（例如带查询参数）。

```ts
import { useSocket } from '@vuecraft/core'
import { ref } from 'vue'

const token = ref('abc')

const { send } = useSocket(() => `wss://example.com/ws?token=${token.value}`)
```

### 重连

启用自动重连，并自定义重试配置。

```ts
import { useSocket } from '@vuecraft/core'

const { status } = useSocket('wss://example.com/ws', {
  reconnect: {
    maxRetries: 5,
    retryInterval: 1000,
    exponentialBackoff: true,
  },
})
```

### 心跳

启用心跳以保持连接活跃并检测僵死连接。

```ts
import { useSocket } from '@vuecraft/core'

const { send } = useSocket('wss://example.com/ws', {
  heartbeat: {
    interval: 3000,
    timeout: 5000,
    pingMessage: { type: 0, msg: 'ping' },
    pongMessage: { type: 0, msg: 'pong' },
  },
})
```

### 按消息类型订阅

使用 `on` / `off` 订阅 `body.type` 匹配特定值的消息。当服务器通过单个连接推送不同类型的消息时，这非常有用。

```ts
import { useSocket } from '@vuecraft/core'

const { on, off } = useSocket('wss://example.com/ws')

function handleUnread(msg) {
  console.log('unread count:', msg.body.count)
}

on(2, handleUnread)

// unsubscribe later
off(2, handleUnread)
```

### 回调函数

你可以在选项中传入回调函数，在连接开启、关闭、出错或接收消息时被调用。

```ts
import { useSocket } from '@vuecraft/core'

const { data, error, status } = useSocket('wss://example.com/ws', {
  onOpen: () => {
    console.log('connected')
  },
  onClose: () => {
    console.log('disconnected')
  },
  onError: (err) => {
    console.log(err)
  },
  onMessage: (msg) => {
    console.log('message:', msg)
  },
})
```

### 发送消息

向服务器发送消息。如果消息是对象，则会被 JSON 序列化。

```ts
import { useSocket } from '@vuecraft/core'

const { send } = useSocket('wss://example.com/ws')

// object will be JSON-serialized
send({ type: 1, body: { msg: 'hello' } })

// string is sent as-is
send('raw text')
```

### 手动断开

你可以通过调用 `disconnect` 函数手动断开连接。在卸载时连接也会自动断开。

```ts
import { useSocket } from '@vuecraft/core'

const { disconnect } = useSocket('wss://example.com/ws')

disconnect()
```

## 类型声明

### SocketStatus

```typescript
enum SocketStatus {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}
```

### SocketOptions

```typescript
interface SocketOptions {
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
```

### SocketReconnectOptions

```typescript
interface SocketReconnectOptions {
  // max retry count (default: 3)
  maxRetries?: number
  // retry interval in ms (default: 3000)
  retryInterval?: number
  // whether to use exponential backoff (default: true)
  exponentialBackoff?: boolean
}
```

### SocketHeartbeatOptions

```typescript
interface SocketHeartbeatOptions {
  // heartbeat interval in ms (default: 30000)
  interval?: number
  // heartbeat timeout in ms (default: 5000)
  timeout?: number
  // ping message content
  pingMessage?: string | Record<string, any>
  // pong message content (used to match heartbeat response)
  pongMessage?: Record<string, any>
}
```

### SocketReturn

```typescript
interface SocketReturn {
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
  // subscribe to messages of a specific body.type
  on: (type: number, callback: EventCallback) => void
  // unsubscribe from messages of a specific body.type
  off: (type: number, callback: EventCallback) => void
}
```
