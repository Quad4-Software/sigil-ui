/**
 * Reactive localStorage-backed state. Reads the stored value on creation,
 * writes on set, and syncs across tabs through the storage event.
 *
 * Must be called during component initialization: it registers an effect
 * for the storage listener.
 */
export function persisted<T>(key: string, initial: T) {
  let value = $state<T>(initial)

  try {
    const raw = localStorage.getItem(key)
    if (raw !== null) value = JSON.parse(raw) as T
  } catch {
    // localStorage unavailable or the stored payload is malformed
  }

  $effect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return
      try {
        value = event.newValue === null ? initial : (JSON.parse(event.newValue) as T)
      } catch {
        // ignore malformed payloads
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  })

  return {
    get current() {
      return value
    },
    set current(next: T) {
      value = next
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {
        // storage may be unavailable in private mode or over quota
      }
    }
  }
}
