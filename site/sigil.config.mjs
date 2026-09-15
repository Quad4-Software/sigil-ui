import { defineConfig } from 'sigil-ui/css'

export default defineConfig({
  include: ['./src/**/*.{svelte,ts}'],
  outdir: 'styled-system',
  preflight: true,
  tokens: {
    colors: {
      sig: {
        bg: 'var(--sig-bg)',
        fg: 'var(--sig-fg)',
        muted: 'var(--sig-muted)',
        surface: 'var(--sig-surface)',
        'surface-hover': 'var(--sig-surface-hover)',
        border: 'var(--sig-border)',
        accent: 'var(--sig-accent)',
        'accent-hover': 'var(--sig-accent-hover)',
        'accent-fg': 'var(--sig-accent-fg)',
        danger: 'var(--sig-danger)',
        'danger-hover': 'var(--sig-danger-hover)',
        'danger-fg': 'var(--sig-danger-fg)',
        success: 'var(--sig-success)',
        'success-fg': 'var(--sig-success-fg)',
        warning: 'var(--sig-warning)',
        'warning-fg': 'var(--sig-warning-fg)',
        info: 'var(--sig-info)',
        'info-fg': 'var(--sig-info-fg)',
        ring: 'var(--sig-ring)',
        overlay: 'var(--sig-overlay)'
      }
    },
    spacing: {
      0: '0',
      px: '1px',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem'
    },
    sizes: {
      auto: 'auto',
      full: '100%',
      screen: '100vw',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem'
    },
    radii: {
      sig: 'var(--sig-radius)',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px'
    },
    shadows: {
      sig: 'var(--sig-shadow)',
      sm: '0 1px 2px rgb(0 0 0 / 0.06)',
      md: '0 4px 8px rgb(0 0 0 / 0.08)'
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    fonts: {
      sans: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    },
    lineHeights: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    letterSpacings: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em'
    }
  },
  recipes: {
    chip: {
      base: {
        rounded: 'full',
        border: '1px solid',
        borderColor: 'sig.border',
        bg: 'sig.surface',
        px: '3',
        py: '1',
        fontSize: 'xs',
        color: 'sig.muted'
      },
      variants: {
        tone: {
          accent: { borderColor: 'sig.accent', color: 'sig.fg' }
        }
      }
    }
  }
})
