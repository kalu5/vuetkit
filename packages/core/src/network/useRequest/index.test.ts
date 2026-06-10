import { expect, it } from 'vitest'

import useRequest from './index'

it('useRequest', () => {
  expect(useRequest()).toBe('useRequest')
})
