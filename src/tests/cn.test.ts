import { describe, expect, it } from 'vitest'
import { cn } from '../lib/utils/cn.js'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('supports arrays and records', () => {
    expect(cn(['a', ['b']], { c: true, d: false })).toBe('a b c')
  })
})
