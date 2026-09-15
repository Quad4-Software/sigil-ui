export type ClassValue =
  string | number | bigint | boolean | null | undefined | ClassValue[] | Record<string, unknown>

/**
 * Merge class values. Accepts strings, numbers, arrays, and objects whose
 * keys are included when the value is truthy. Falsy values are skipped.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === 'string' || typeof input === 'number' || typeof input === 'bigint') {
      out.push(String(input))
    } else if (Array.isArray(input)) {
      const inner = cn(...input)
      if (inner) out.push(inner)
    } else if (typeof input === 'object') {
      for (const key of Object.keys(input)) {
        if (input[key]) out.push(key)
      }
    }
  }
  return out.join(' ')
}
