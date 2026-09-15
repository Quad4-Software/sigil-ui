/**
 * UnoCSS preset mapping the sigil-ui token contract into theme colors.
 * Enables utilities like bg-sig-accent, text-sig-fg, border-sig-border.
 * Pair with a wind preset for the utility grammar itself.
 */
export const sigilPreset = {
  name: 'sigil-ui',
  theme: {
    colors: {
      'sig-bg': 'var(--sig-bg)',
      'sig-fg': 'var(--sig-fg)',
      'sig-muted': 'var(--sig-muted)',
      'sig-surface': 'var(--sig-surface)',
      'sig-surface-hover': 'var(--sig-surface-hover)',
      'sig-border': 'var(--sig-border)',
      'sig-accent': 'var(--sig-accent)',
      'sig-accent-hover': 'var(--sig-accent-hover)',
      'sig-accent-fg': 'var(--sig-accent-fg)',
      'sig-danger': 'var(--sig-danger)',
      'sig-danger-hover': 'var(--sig-danger-hover)',
      'sig-danger-fg': 'var(--sig-danger-fg)',
      'sig-success': 'var(--sig-success)',
      'sig-success-fg': 'var(--sig-success-fg)',
      'sig-warning': 'var(--sig-warning)',
      'sig-warning-fg': 'var(--sig-warning-fg)',
      'sig-info': 'var(--sig-info)',
      'sig-info-fg': 'var(--sig-info-fg)',
      'sig-ring': 'var(--sig-ring)',
      'sig-overlay': 'var(--sig-overlay)'
    }
  },
  rules: [
    [/^sig-radius$/, () => ({ 'border-radius': 'var(--sig-radius)' })],
    [/^sig-shadow$/, () => ({ 'box-shadow': 'var(--sig-shadow)' })]
  ] as [RegExp, () => Record<string, string>][]
}
