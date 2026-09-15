import { persisted } from '../utils/persisted.svelte.js'

export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Theme controller for the --sig-* token contract. Persists the chosen mode,
 * tracks the system color scheme, and stamps data-theme on the document root
 * so theme.css (or the consumer's own token file) picks it up.
 *
 * Must be created during component initialization, not inside an event
 * handler: it registers effects.
 */
export function createTheme(
  options: { key?: string; defaultMode?: ThemeMode; accent?: string; accentFg?: string } = {}
) {
  const { key = 'sig-theme', defaultMode = 'system', accent, accentFg } = options

  const mode = persisted<ThemeMode>(key, defaultMode)
  let systemDark = $state(false)
  let accentColor = $state(accent)
  let accentFgColor = $state(accentFg)

  $effect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark = mq.matches
    const onChange = (event: MediaQueryListEvent) => {
      systemDark = event.matches
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  })

  const resolved = $derived<'light' | 'dark'>(
    mode.current === 'system' ? (systemDark ? 'dark' : 'light') : mode.current
  )

  $effect(() => {
    document.documentElement.dataset.theme = resolved
  })

  // one accent value derives hover, ring, chart and muted so a single
  // override rethemes every accent surface. Setting null clears the
  // inline overrides and falls back to the stylesheet values
  $effect(() => {
    const el = document.documentElement
    const names = ['--sig-accent', '--sig-accent-hover', '--sig-ring', '--sig-chart-1']
    if (accentColor) {
      el.style.setProperty('--sig-accent', accentColor)
      el.style.setProperty('--sig-accent-hover', `color-mix(in oklab, ${accentColor} 85%, black)`)
      el.style.setProperty('--sig-ring', accentColor)
      el.style.setProperty('--sig-chart-1', accentColor)
      if (accentFgColor) el.style.setProperty('--sig-accent-fg', accentFgColor)
    } else {
      for (const n of names) el.style.removeProperty(n)
      el.style.removeProperty('--sig-accent-fg')
    }
  })

  return {
    get mode() {
      return mode.current
    },
    set mode(value: ThemeMode) {
      mode.current = value
    },
    get resolved() {
      return resolved
    },
    get accent() {
      return accentColor
    },
    set accent(value: string | undefined) {
      accentColor = value
    },
    get accentFg() {
      return accentFgColor
    },
    set accentFg(value: string | undefined) {
      accentFgColor = value
    },
    toggle() {
      mode.current = resolved === 'dark' ? 'light' : 'dark'
    }
  }
}
