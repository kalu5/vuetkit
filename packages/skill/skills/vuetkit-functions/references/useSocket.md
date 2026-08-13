---
category: network
package: @vuetkit/core
---

# useSocket

Manage a WebSocket connection with auto-reconnection, heartbeat, and message-type-based subscriptions.

::: tip :zap:Feature

1. Auto connect on mount and disconnect on unmount.
2. Built-in reconnection with exponential backoff.
3. Built-in heartbeat with ping/pong and timeout detection.
4. Subscribe to messages by `body.type` or receive all messages via `onMessage`.
5. Manage `status`, `data` and `error` state.
   :::

## Basic Usage

```ts
import { useSocket } from '@vuetkit/core'

const { status, data, send, on, connect, disconnect } = useSocket('wss://example.com/ws')

// subscribe to messages of a specific type
on(2, (msg) => {
  console.log('unread count:', msg.body.count)
})
```

## Options

<table>
  <thead>
   <tr>
    <th>Option</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  </thead>
  <tbody>

  <tr>
    <td>autoConnect</td>
    <td>boolean</td>
    <td>true</td>
    <td>
      Default auto connect to the WebSocket server immediately after mounted. You can set it to `false` to manually connect via the `connect` function.
    </td>
  </tr>

  <tr>
    <td>protocols</td>
    <td>string | string[]</td>
    <td>undefined</td>
    <td>
      The WebSocket sub-protocols to use when opening the connection.
    </td>
  </tr>

  <tr>
    <td>reconnect</td>
    <td>object</td>
    <td>undefined</td>
    <td>
      <p>Reconnection configuration. When provided, the client will automatically retry on connection failure.</p>
      <p>- <code>maxRetries</code>: max retry count (default: <code>3</code>).</p>
      <p>- <code>retryInterval</code>: retry interval in ms (default: <code>3000</code>).</p>
      <p>- <code>exponentialBackoff</code>: whether to use exponential backoff (default: <code>true</code>).</p>
    </td>
  </tr>

  <tr>
    <td>heartbeat</td>
    <td>object</td>
    <td>undefined</td>
    <td>
      <p>Heartbeat configuration. When provided, the client will periodically send ping messages and detect timeout.</p>
      <p>- <code>interval</code>: heartbeat interval in ms (default: <code>30000</code>).</p>
      <p>- <code>timeout</code>: heartbeat timeout in ms (default: <code>5000</code>).</p>
      <p>- <code>pingMessage</code>: ping message content.</p>
      <p>- <code>pongMessage</code>: pong message content used to match heartbeat response.</p>
    </td>
  </tr>

  <tr>
    <td>onOpen</td>
    <td>function</td>
    <td>undefined</td>
    <td>
      The callback function to call when the connection opens.
    </td>
  </tr>

  <tr>
    <td>onClose</td>
    <td>function</td>
    <td>undefined</td>
    <td>
      The callback function to call when the connection closes.
    </td>
  </tr>

  <tr>
    <td>onError</td>
    <td>function</td>
    <td>undefined</td>
    <td>
      The callback function to call when an error occurs.
    </td>
  </tr>

  <tr>
    <td>onMessage</td>
    <td>function</td>
    <td>undefined</td>
    <td>
      The callback function to call when a message is received. All non-heartbeat messages trigger this callback.
    </td>
  </tr>
  </tbody>
</table>

## Return Value

<table>
  <thead>
   <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>client</td>
    <td>Ref&lt;WebSocketClient | null&gt;</td>
    <td>
      The underlying WebSocket client instance.
    </td>
  </tr>
  <tr>
    <td>status</td>
    <td>Ref&lt;SocketStatus&gt;</td>
    <td>
      The current connection status. One of <code>CONNECTING</code>, <code>OPEN</code>, <code>CLOSING</code>, <code>CLOSED</code>.
    </td>
  </tr>
  <tr>
    <td>data</td>
    <td>Ref&lt;any&gt;</td>
    <td>
      The latest received message.
    </td>
  </tr>
  <tr>
    <td>error</td>
    <td>Ref&lt;unknown&gt;</td>
    <td>
      The latest error.
    </td>
  </tr>
  <tr>
    <td>connect</td>
    <td>function</td>
    <td>
      The function to connect to the WebSocket server manually.
    </td>
  </tr>
  <tr>
    <td>disconnect</td>
    <td>function</td>
    <td>
      The function to disconnect from the WebSocket server.
    </td>
  </tr>
  <tr>
    <td>reconnect</td>
    <td>function</td>
    <td>
      The function to reconnect to the WebSocket server.
    </td>
  </tr>
  <tr>
    <td>send</td>
    <td>function</td>
    <td>
      The function to send a message to the server.
    </td>
  </tr>
  <tr>
    <td>on</td>
    <td>function</td>
    <td>
      Subscribe to messages of a specific <code>body.type</code>.
    </td>
  </tr>
  <tr>
    <td>off</td>
    <td>function</td>
    <td>
      Unsubscribe from messages of a specific <code>body.type</code>.
    </td>
  </tr>
  </tbody>
</table>

## More Example

### Manual Connect

By default, the connection will be opened immediately after mounted.
You can manually connect by setting `autoConnect` to `false` and then call `connect` to trigger the connection.

```ts
import { useSocket } from '@vuetkit/core'
import { onMounted } from 'vue'

const { status, connect } = useSocket('wss://example.com/ws', {
  autoConnect: false,
})

onMounted(() => {
  connect()
})
```

### Dynamic URL

The `url` parameter accepts a `string`, a `ref`, or a getter function, so you can build the URL dynamically (e.g. with query params).

```ts
import { useSocket } from '@vuetkit/core'
import { ref } from 'vue'

const token = ref('abc')

const { send } = useSocket(() => `wss://example.com/ws?token=${token.value}`)
```

### Reconnect

Enable automatic reconnection with custom retry configuration.

```ts
import { useSocket } from '@vuetkit/core'

const { status } = useSocket('wss://example.com/ws', {
  reconnect: {
    maxRetries: 5,
    retryInterval: 1000,
    exponentialBackoff: true,
  },
})
```

### Heartbeat

Enable heartbeat to keep the connection alive and detect stale connections.

```ts
import { useSocket } from '@vuetkit/core'

const { send } = useSocket('wss://example.com/ws', {
  heartbeat: {
    interval: 3000,
    timeout: 5000,
    pingMessage: { type: 0, msg: 'ping' },
    pongMessage: { type: 0, msg: 'pong' },
  },
})
```

### Subscribe by Message Type

Use `on` / `off` to subscribe to messages whose `body.type` matches a specific value. This is useful when the server pushes different types of messages over a single connection.

```ts
import { useSocket } from '@vuetkit/core'

const { on, off } = useSocket('wss://example.com/ws')

function handleUnread(msg) {
  console.log('unread count:', msg.body.count)
}

on(2, handleUnread)

// unsubscribe later
off(2, handleUnread)
```

### Callbacks

You can pass callback functions to the options to be called when the connection opens, closes, errors, or receives a message.

```ts
import { useSocket } from '@vuetkit/core'

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

### Send Message

Send a message to the server. The message will be JSON-serialized if it is an object.

```ts
import { useSocket } from '@vuetkit/core'

const { send } = useSocket('wss://example.com/ws')

// object will be JSON-serialized
send({ type: 1, body: { msg: 'hello' } })

// string is sent as-is
send('raw text')
```

### Manual Disconnect

You can disconnect manually by calling the `disconnect` function. The connection will also be disconnected automatically on unmount.

```ts
import { useSocket } from '@vuetkit/core'

const { disconnect } = useSocket('wss://example.com/ws')

disconnect()
```

## Type Declarations

```ts
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { EventCallback } from './socket-client'

export enum SocketStatus {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export interface SocketReconnectOptions {
  // max retry count
  maxRetries?: number
  // retry interval in ms
  retryInterval?: number
  // whether to use exponential backoff
  exponentialBackoff?: boolean
}

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

export function useSocket(
  url: MaybeRefOrGetter<string>,
  options?: SocketOptions,
): SocketReturn;
```
