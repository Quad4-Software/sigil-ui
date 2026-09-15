import '@testing-library/jest-dom/vitest'

const noop = () => undefined

// jsdom lacks these APIs that bits-ui primitives touch
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: noop,
      removeEventListener: noop,
      addListener: noop,
      removeListener: noop,
      dispatchEvent: () => false
    }) as MediaQueryList
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe = noop
    unobserve = noop
    disconnect = noop
  } as unknown as typeof ResizeObserver
}
