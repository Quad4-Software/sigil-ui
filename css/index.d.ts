export interface SigilCssTokenLeaf {
  value: string | number
}

export interface SigilCssConfig {
  /** Glob patterns (relative to cwd) scanned for style calls. */
  include?: string[]
  /** Directory for generated runtime and styles.css. Default styled-system. */
  outdir?: string
  /** Emit a minimal reset at the top of styles.css. Default true. */
  preflight?: boolean
  /** min-width breakpoints, merged over sm/md/lg/xl/2xl defaults. */
  breakpoints?: Record<string, string>
  /** Token groups. Leafs are raw values or { value } objects. */
  tokens?: {
    colors?: Record<string, string | number | SigilCssTokenLeaf | Record<string, unknown>>
    spacing?: Record<string, string | number | SigilCssTokenLeaf>
    sizes?: Record<string, string | number | SigilCssTokenLeaf>
    radii?: Record<string, string | number | SigilCssTokenLeaf>
    shadows?: Record<string, string | number | SigilCssTokenLeaf>
    fontSizes?: Record<string, string | number | SigilCssTokenLeaf>
    fontWeights?: Record<string, string | number | SigilCssTokenLeaf>
    fonts?: Record<string, string | number | SigilCssTokenLeaf>
    lineHeights?: Record<string, string | number | SigilCssTokenLeaf>
    [category: string]: Record<string, unknown> | undefined
  }
}

export declare function defineConfig(config: SigilCssConfig): SigilCssConfig
