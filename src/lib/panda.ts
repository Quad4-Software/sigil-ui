/**
 * Panda CSS preset mapping the sigil-ui token contract into Panda tokens.
 * Enables styles like { bg: 'sig.accent', color: 'sig.fg' } and the
 * sig.radius / sig.shadow tokens. Pass it in the presets array of
 * panda.config.ts.
 */
export const sigilPreset = {
  name: 'sigil-ui',
  theme: {
    extend: {
      tokens: {
        colors: {
          sig: {
            bg: { value: 'var(--sig-bg)' },
            fg: { value: 'var(--sig-fg)' },
            muted: { value: 'var(--sig-muted)' },
            surface: { value: 'var(--sig-surface)' },
            'surface-hover': { value: 'var(--sig-surface-hover)' },
            border: { value: 'var(--sig-border)' },
            accent: { value: 'var(--sig-accent)' },
            'accent-hover': { value: 'var(--sig-accent-hover)' },
            'accent-fg': { value: 'var(--sig-accent-fg)' },
            danger: { value: 'var(--sig-danger)' },
            'danger-hover': { value: 'var(--sig-danger-hover)' },
            'danger-fg': { value: 'var(--sig-danger-fg)' },
            success: { value: 'var(--sig-success)' },
            'success-fg': { value: 'var(--sig-success-fg)' },
            warning: { value: 'var(--sig-warning)' },
            'warning-fg': { value: 'var(--sig-warning-fg)' },
            info: { value: 'var(--sig-info)' },
            'info-fg': { value: 'var(--sig-info-fg)' },
            ring: { value: 'var(--sig-ring)' },
            overlay: { value: 'var(--sig-overlay)' }
          }
        },
        radii: {
          sig: { value: 'var(--sig-radius)' }
        },
        shadows: {
          sig: { value: 'var(--sig-shadow)' }
        }
      }
    }
  }
}
