// Framework-free theme controller. Mirrors lib/theme/theme.svelte.ts: persists
// the mode, tracks the system scheme, stamps data-theme on the document root.

import { persistedValue } from './persisted.js'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeController {
  mode: ThemeMode
  readonly resolved: ResolvedTheme
  set(mode: ThemeMode): void
  toggle(): void
  destroy(): void
}

export function createTheme(
  options: {
    key?: string
    defaultMode?: ThemeMode
    onChange?: (resolved: ResolvedTheme) => void
  } = {}
): ThemeController {
  const { key = 'sig-theme', defaultMode = 'system', onChange } = options
  const store = persistedValue<ThemeMode>(key, defaultMode, () => apply())
  let systemDark =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

  const mq =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null
  const onScheme = (event: MediaQueryListEvent) => {
    systemDark = event.matches
    apply()
  }
  mq?.addEventListener('change', onScheme)

  function resolved(): ResolvedTheme {
    const mode = store.value
    return mode === 'system' ? (systemDark ? 'dark' : 'light') : mode
  }

  function apply() {
    const r = resolved()
    document.documentElement.dataset.theme = r
    onChange?.(r)
  }
  apply()

  return {
    get mode() {
      return store.value
    },
    set mode(mode: ThemeMode) {
      store.value = mode
      apply()
    },
    get resolved() {
      return resolved()
    },
    set(mode: ThemeMode) {
      store.value = mode
      apply()
    },
    toggle() {
      store.value = resolved() === 'dark' ? 'light' : 'dark'
      apply()
    },
    destroy() {
      mq?.removeEventListener('change', onScheme)
      store.destroy()
    }
  }
}
