import { PersistedState } from 'runed'

export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Theme controller for the --sig-* token contract. Persists the chosen mode,
 * tracks the system color scheme, and stamps data-theme on the document root
 * so theme.css (or the consumer's own token file) picks it up.
 *
 * Must be created during component initialization, not inside an event
 * handler: it registers effects.
 */
export function createTheme(options: { key?: string; defaultMode?: ThemeMode } = {}) {
  const { key = 'sig-theme', defaultMode = 'system' } = options

  const mode = new PersistedState<ThemeMode>(key, defaultMode, {
    storage: 'local',
    syncTabs: true
  })
  let systemDark = $state(false)

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
    toggle() {
      mode.current = resolved === 'dark' ? 'light' : 'dark'
    }
  }
}
