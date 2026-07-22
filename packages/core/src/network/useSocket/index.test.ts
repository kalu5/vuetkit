import { mount } from '@vue/test-utils'

// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref as vueRef } from 'vue'
import { SocketStatus, useSocket } from './index'

beforeEach(() => {
  vi.useFakeTimers()
  vi.clearAllMocks()
})

interface Harness<T> {
  result: T
  unmount: () => void
}

function runInComponent<T>(setup: () => T): Harness<T> {
  let result: T
  const Comp = defineComponent({
    setup() {
      result = setup()
      return () => null
    },
  })
  const wrapper = mount(Comp)
  return {
    result: result!,
    unmount: () => wrapper.unmount(),
  }
}

// ----- Mock WebSocket -----
type MockWSEvent = 'open' | 'close' | 'error' | 'message'

class MockWebSocket {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3

  static instances: MockWebSocket[] = []
  static lastInstance: MockWebSocket | null = null

  url: string
  protocols: string | string[] | undefined
  readyState: number = MockWebSocket.CONNECTING

  onopen: (() => void) | null = null
  onclose: (() => void) | null = null
  onerror: ((error: any) => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null

  sent: string[] = []
  closeCalls: { code?: number, reason?: string }[] = []

  constructor(url: string, protocols?: string | string[]) {
    this.url = url
    this.protocols = protocols
    MockWebSocket.instances.push(this)
    MockWebSocket.lastInstance = this
  }

  send(data: string) {
    this.sent.push(data)
  }

  close(code?: number, reason?: string) {
    this.readyState = MockWebSocket.CLOSED
    this.closeCalls.push({ code, reason })
  }

  // test helpers
  trigger(event: MockWSEvent, payload?: any) {
    if (event === 'open') {
      this.readyState = MockWebSocket.OPEN
      this.onopen?.()
    }
    else if (event === 'close') {
      this.readyState = MockWebSocket.CLOSED
      this.onclose?.()
    }
    else if (event === 'error') {
      this.onerror?.(payload)
    }
    else if (event === 'message') {
      this.onmessage?.({ data: typeof payload === 'string' ? payload : JSON.stringify(payload) })
    }
  }
}

function installMockWebSocket() {
  MockWebSocket.instances = []
  MockWebSocket.lastInstance = null
  // expose constants expected by the client implementation
  ;(MockWebSocket as any).CONNECTING = 0
  ;(MockWebSocket as any).OPEN = 1
  ;(MockWebSocket as any).CLOSING = 2
  ;(MockWebSocket as any).CLOSED = 3
  vi.stubGlobal('WebSocket', MockWebSocket)
}

describe('useSocket', () => {
  beforeEach(() => {
    installMockWebSocket()
  })

  it('returns expected shape (client, status, data, error, connect, disconnect, reconnect, send, on, off)', () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    expect(res.client).toBeDefined()
    expect(res.status).toBeDefined()
    expect(res.data).toBeDefined()
    expect(res.error).toBeDefined()
    expect(typeof res.connect).toBe('function')
    expect(typeof res.disconnect).toBe('function')
    expect(typeof res.reconnect).toBe('function')
    expect(typeof res.send).toBe('function')
    expect(typeof res.on).toBe('function')
    expect(typeof res.off).toBe('function')
    expect(res.status.value).toBe(SocketStatus.CLOSED)
    expect(res.data.value).toBe(null)
    expect(res.error.value).toBe(undefined)
  })

  it('auto connects on mount when autoConnect is true (default)', () => {
    runInComponent(() => useSocket('ws://auto'))
    expect(MockWebSocket.instances).toHaveLength(1)
    expect(MockWebSocket.lastInstance!.url).toBe('ws://auto')
    expect(MockWebSocket.lastInstance!.readyState).toBe(MockWebSocket.CONNECTING)
  })

  it('does not auto connect when autoConnect is false', () => {
    runInComponent(() => useSocket('ws://manual', { autoConnect: false }))
    expect(MockWebSocket.instances).toHaveLength(0)
  })

  it('status becomes CONNECTING after connect and OPEN after open event', async () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.connect()
    expect(res.status.value).toBe(SocketStatus.CONNECTING)
    MockWebSocket.lastInstance!.trigger('open')
    await nextTick()
    expect(res.status.value).toBe(SocketStatus.OPEN)
  })

  it('status becomes CLOSED after close event', async () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    MockWebSocket.lastInstance!.trigger('close')
    await nextTick()
    expect(res.status.value).toBe(SocketStatus.CLOSED)
  })

  it('onOpen callback is called when connection opens', async () => {
    const onOpen = vi.fn()
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false, onOpen }))
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    await nextTick()
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('onClose callback is called when connection closes', async () => {
    const onClose = vi.fn()
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false, onClose }))
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    MockWebSocket.lastInstance!.trigger('close')
    await nextTick()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('onError callback is called and error ref is set on error event', async () => {
    const onError = vi.fn()
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false, onError }))
    res.connect()
    const err = new Error('boom')
    MockWebSocket.lastInstance!.trigger('error', err)
    await nextTick()
    expect(onError).toHaveBeenCalledWith(err)
    expect(res.error.value).toBe(err)
  })

  it('onMessage callback is called with parsed message and data ref is updated', async () => {
    const onMessage = vi.fn()
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false, onMessage }))
    res.connect()
    const msg = { body: { type: 1, msg: 'hello' } }
    MockWebSocket.lastInstance!.trigger('message', msg)
    await nextTick()
    expect(onMessage).toHaveBeenCalledWith(msg)
    expect(res.data.value).toEqual(msg)
  })

  it('dispatches messages to type-specific subscribers via on(type, cb)', async () => {
    const cb = vi.fn()
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.on(2, cb)
    res.connect()
    const msg = { body: { type: 2, count: 5 } }
    MockWebSocket.lastInstance!.trigger('message', msg)
    await nextTick()
    expect(cb).toHaveBeenCalledWith(msg)
  })

  it('does not dispatch to subscribers of other types', async () => {
    const cb = vi.fn()
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.on(2, cb)
    res.connect()
    MockWebSocket.lastInstance!.trigger('message', { body: { type: 3, msg: 'other' } })
    await nextTick()
    expect(cb).not.toHaveBeenCalled()
  })

  it('off removes a previously registered type subscriber', async () => {
    const cb = vi.fn()
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.on(2, cb)
    res.off(2, cb)
    res.connect()
    MockWebSocket.lastInstance!.trigger('message', { body: { type: 2, msg: 'x' } })
    await nextTick()
    expect(cb).not.toHaveBeenCalled()
  })

  it('multiple subscribers for the same type are all called', async () => {
    const cb1 = vi.fn()
    const cb2 = vi.fn()
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.on(2, cb1)
    res.on(2, cb2)
    res.connect()
    const msg = { body: { type: 2, msg: 'x' } }
    MockWebSocket.lastInstance!.trigger('message', msg)
    await nextTick()
    expect(cb1).toHaveBeenCalledWith(msg)
    expect(cb2).toHaveBeenCalledWith(msg)
  })

  it('send serializes object messages to JSON', async () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    res.send({ type: 1, body: { msg: 'hello' } })
    expect(MockWebSocket.lastInstance!.sent).toHaveLength(1)
    expect(MockWebSocket.lastInstance!.sent[0]).toBe(JSON.stringify({ type: 1, body: { msg: 'hello' } }))
  })

  it('send sends string messages as-is', async () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    res.send('raw text')
    expect(MockWebSocket.lastInstance!.sent[0]).toBe('raw text')
  })

  it('send is a no-op when not connected', () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.connect()
    // connection still CONNECTING, not OPEN
    res.send({ type: 1 })
    expect(MockWebSocket.lastInstance!.sent).toHaveLength(0)
  })

  it('disconnect closes the underlying socket and sets status to CLOSED', async () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.connect()
    const ws = MockWebSocket.lastInstance!
    res.disconnect()
    expect(ws.closeCalls).toHaveLength(1)
    expect(res.status.value).toBe(SocketStatus.CLOSED)
    expect(res.client.value).toBe(null)
  })

  it('disconnect clears type subscribers', async () => {
    const cb = vi.fn()
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.on(2, cb)
    res.connect()
    res.disconnect()
    res.connect()
    MockWebSocket.lastInstance!.trigger('message', { body: { type: 2, msg: 'x' } })
    await nextTick()
    expect(cb).not.toHaveBeenCalled()
  })

  it('connect is a no-op when already connected', () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.connect()
    res.connect()
    expect(MockWebSocket.instances).toHaveLength(1)
  })

  it('url accepts a ref and resolves to its value', () => {
    const urlRef = vueRef('ws://dynamic')
    const { result: res } = runInComponent(() => useSocket(urlRef, { autoConnect: false }))
    urlRef.value = 'ws://changed'
    res.connect()
    expect(MockWebSocket.lastInstance!.url).toBe('ws://changed')
  })

  it('url accepts a getter function and resolves dynamically', () => {
    const token = vueRef('abc')
    const { result: res } = runInComponent(() => useSocket(() => `ws://x?token=${token.value}`, { autoConnect: false }))
    token.value = 'def'
    res.connect()
    expect(MockWebSocket.lastInstance!.url).toBe('ws://x?token=def')
  })

  it('protocols are passed through to the WebSocket constructor', () => {
    runInComponent(() => useSocket('ws://x', { autoConnect: true, protocols: ['proto1'] }))
    expect(MockWebSocket.lastInstance!.protocols).toEqual(['proto1'])
  })

  it('auto disconnects on unmount', () => {
    const harness = runInComponent(() => useSocket('ws://x'))
    const ws = MockWebSocket.lastInstance!
    harness.unmount()
    expect(ws.closeCalls).toHaveLength(1)
  })

  it('heartbeat sends ping messages at the configured interval', async () => {
    const { result: res } = runInComponent(() =>
      useSocket('ws://x', {
        autoConnect: false,
        heartbeat: {
          interval: 3000,
          timeout: 5000,
          pingMessage: { type: 0, msg: 'ping' },
        },
      }),
    )
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    // first ping fires after interval
    vi.advanceTimersByTime(3000)
    expect(MockWebSocket.lastInstance!.sent).toHaveLength(1)
    expect(MockWebSocket.lastInstance!.sent[0]).toBe(JSON.stringify({ type: 0, msg: 'ping' }))
    // second ping fires after another interval
    vi.advanceTimersByTime(3000)
    expect(MockWebSocket.lastInstance!.sent).toHaveLength(2)
  })

  it('heartbeat emits error on timeout when no pong received', async () => {
    const onError = vi.fn()
    const { result: res } = runInComponent(() =>
      useSocket('ws://x', {
        autoConnect: false,
        heartbeat: {
          interval: 3000,
          timeout: 1000,
          pingMessage: { type: 0, msg: 'ping' },
        },
        onError,
      }),
    )
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    // fire the heartbeat ping
    vi.advanceTimersByTime(3000)
    // advance past the timeout without a pong
    vi.advanceTimersByTime(1000)
    expect(onError).toHaveBeenCalledTimes(1)
    expect(res.error.value).toBeInstanceOf(Error)
  })

  it('heartbeat cancels timeout when pong is received', async () => {
    const onError = vi.fn()
    const { result: res } = runInComponent(() =>
      useSocket('ws://x', {
        autoConnect: false,
        heartbeat: {
          interval: 3000,
          timeout: 1000,
          pingMessage: { type: 0, msg: 'ping' },
          pongMessage: { type: 0, msg: 'pong' },
        },
        onError,
      }),
    )
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    // fire the heartbeat ping
    vi.advanceTimersByTime(3000)
    // server responds with pong before timeout fires
    MockWebSocket.lastInstance!.trigger('message', { body: { type: 0, msg: 'pong' } })
    vi.advanceTimersByTime(1000)
    expect(onError).not.toHaveBeenCalled()
  })

  it('heartbeat pong message is not dispatched to onMessage', async () => {
    const onMessage = vi.fn()
    const { result: res } = runInComponent(() =>
      useSocket('ws://x', {
        autoConnect: false,
        heartbeat: {
          interval: 3000,
          timeout: 1000,
          pingMessage: { type: 0, msg: 'ping' },
          pongMessage: { type: 0, msg: 'pong' },
        },
        onMessage,
      }),
    )
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    MockWebSocket.lastInstance!.trigger('message', { body: { type: 0, msg: 'pong' } })
    await nextTick()
    expect(onMessage).not.toHaveBeenCalled()
    expect(res.data.value).toBe(null)
  })

  it('reconnect attempts multiple times when connection fails', async () => {
    // stub WebSocket to always throw on construction so reconnect kicks in
    let constructCount = 0
    const throwingWebSocket = class {
      static CONNECTING = 0
      static OPEN = 1
      static CLOSING = 2
      static CLOSED = 3
      constructor() {
        constructCount++
        throw new Error('connection refused')
      }
    }
    vi.stubGlobal('WebSocket', throwingWebSocket)

    const { result: res } = runInComponent(() =>
      useSocket('ws://x', {
        autoConnect: false,
        reconnect: {
          maxRetries: 3,
          retryInterval: 1000,
          exponentialBackoff: false,
        },
      }),
    )
    res.connect()
    // first connect attempt throws (constructCount === 1) and schedules a reconnect
    expect(constructCount).toBe(1)
    // advance through 3 retry intervals - each retry calls connect() which throws again
    vi.advanceTimersByTime(1000)
    expect(constructCount).toBe(2)
    vi.advanceTimersByTime(1000)
    expect(constructCount).toBe(3)
    vi.advanceTimersByTime(1000)
    expect(constructCount).toBe(4)
    // maxRetries reached, no further reconnect attempts
    vi.advanceTimersByTime(5000)
    expect(constructCount).toBe(4)
    expect(res.status.value).toBe(SocketStatus.CONNECTING)
  })

  it('does not reconnect when no reconnect options are provided', () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.connect()
    const initialCount = MockWebSocket.instances.length
    res.reconnect()
    // no reconnect options -> reconnect() on the client is a no-op
    expect(MockWebSocket.instances.length).toBe(initialCount)
  })

  it('reconnect when no client exists calls connect', () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.reconnect()
    expect(MockWebSocket.instances).toHaveLength(1)
  })

  it('previous error remains but new error updates error ref', async () => {
    const { result: res } = runInComponent(() => useSocket('ws://x', { autoConnect: false }))
    res.connect()
    const err1 = new Error('first')
    MockWebSocket.lastInstance!.trigger('error', err1)
    await nextTick()
    expect(res.error.value).toBe(err1)
    const err2 = new Error('second')
    MockWebSocket.lastInstance!.trigger('error', err2)
    await nextTick()
    expect(res.error.value).toBe(err2)
  })

  it('multiple useSocket calls maintain independent state', async () => {
    const { result: res1 } = runInComponent(() => useSocket('ws://a', { autoConnect: false }))
    const { result: res2 } = runInComponent(() => useSocket('ws://b', { autoConnect: false }))
    res1.connect()
    res2.connect()
    expect(MockWebSocket.instances).toHaveLength(2)
    expect(MockWebSocket.instances[0].url).toBe('ws://a')
    expect(MockWebSocket.instances[1].url).toBe('ws://b')

    const cb1 = vi.fn()
    const cb2 = vi.fn()
    res1.on(1, cb1)
    res2.on(1, cb2)

    // trigger message on first socket
    MockWebSocket.instances[0].trigger('message', { body: { type: 1, msg: 'a' } })
    await nextTick()
    expect(cb1).toHaveBeenCalledTimes(1)
    expect(cb2).not.toHaveBeenCalled()
  })

  it('error message with ESocketType.ERROR type triggers error path', async () => {
    const onMessage = vi.fn()
    const onError = vi.fn()
    const { result: res } = runInComponent(() =>
      useSocket('ws://x', { autoConnect: false, onMessage, onError }),
    )
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    // server sends a message with ERROR type (-1)
    MockWebSocket.lastInstance!.trigger('message', { body: { type: -1, msg: 'server error' } })
    await nextTick()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onMessage).not.toHaveBeenCalled()
    expect(res.error.value).toBeInstanceOf(Error)
  })

  it('works with no options passed (defaults applied)', () => {
    runInComponent(() => useSocket('ws://x'))
    expect(MockWebSocket.instances).toHaveLength(1)
  })

  it('invalid JSON message triggers error and does not update data', async () => {
    const onMessage = vi.fn()
    const onError = vi.fn()
    const { result: res } = runInComponent(() =>
      useSocket('ws://x', { autoConnect: false, onMessage, onError }),
    )
    res.connect()
    MockWebSocket.lastInstance!.trigger('open')
    // send raw invalid JSON directly via the underlying onmessage
    MockWebSocket.lastInstance!.onmessage!({ data: 'not-json' })
    await nextTick()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onMessage).not.toHaveBeenCalled()
    expect(res.data.value).toBe(null)
    expect(res.error.value).toBeDefined()
  })
})
