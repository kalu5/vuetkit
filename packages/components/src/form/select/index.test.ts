import { expect, it } from 'vitest'

import { test } from './index'

it('select', () => {
  expect(test()).toBe('test')
})
