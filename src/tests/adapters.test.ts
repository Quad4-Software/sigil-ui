import { describe, expect, it } from 'vitest'
import { manifest } from '../lib/index.js'
import { sigilPreset as pandaPreset } from '../lib/panda.js'
import { sigilPreset as unoPreset } from '../lib/uno.js'

// radius, shadow and the space scale are sizing tokens, not colors
const colorVars = manifest.tokens
  .map((t) => t.name)
  .filter((v) => v !== '--sig-radius' && v !== '--sig-shadow' && !v.startsWith('--sig-space-'))
const spaceVars = manifest.tokens.map((t) => t.name).filter((v) => v.startsWith('--sig-space-'))

describe('uno preset', () => {
  it('exposes every color --sig-* token as a theme color', () => {
    expect(unoPreset.name).toBe('sigil-ui')
    for (const v of colorVars) {
      const key = v.replace('--', '')
      expect(unoPreset.theme.colors[key as keyof typeof unoPreset.theme.colors]).toBe(`var(${v})`)
    }
  })

  it('exposes every --sig-space-* token as a spacing value', () => {
    const spacing = unoPreset.theme.spacing as Record<string, string>
    for (const v of spaceVars) {
      const key = `sig-${v.replace('--sig-space-', '')}`
      expect(spacing[key]).toBe(`var(${v})`)
    }
  })

  it('maps radius and shadow rules to the token contract', () => {
    const [radiusRule, radiusValue] = unoPreset.rules[0] as [RegExp, () => Record<string, string>]
    const [shadowRule, shadowValue] = unoPreset.rules[1] as [RegExp, () => Record<string, string>]
    expect(radiusRule.test('sig-radius')).toBe(true)
    expect(radiusValue()['border-radius']).toBe('var(--sig-radius)')
    expect(shadowRule.test('sig-shadow')).toBe(true)
    expect(shadowValue()['box-shadow']).toBe('var(--sig-shadow)')
  })
})

describe('panda preset', () => {
  it('exposes every color --sig-* token as sig.* color tokens', () => {
    expect(pandaPreset.name).toBe('sigil-ui')
    const colors = pandaPreset.theme.extend.tokens.colors.sig as Record<string, { value: string }>
    for (const v of colorVars) {
      const key = v.replace('--sig-', '')
      expect(colors[key]?.value).toBe(`var(${v})`)
    }
  })

  it('maps radius and shadow tokens', () => {
    const tokens = pandaPreset.theme.extend.tokens
    expect(tokens.radii.sig.value).toBe('var(--sig-radius)')
    expect(tokens.shadows.sig.value).toBe('var(--sig-shadow)')
  })

  it('exposes every --sig-space-* token as sig.* spacing tokens', () => {
    const spacing = pandaPreset.theme.extend.tokens.spacing.sig as Record<string, { value: string }>
    for (const v of spaceVars) {
      const key = v.replace('--sig-space-', '')
      expect(spacing[key]?.value).toBe(`var(${v})`)
    }
  })
})
