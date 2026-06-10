import { expect, it } from 'vitest'

import { useDemo } from './index'

it('useDemo', () => {
  expect(useDemo()).toBe('hello useDemo')
})
