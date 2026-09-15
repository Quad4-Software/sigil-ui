export type SigilCssTokenValue =
  string | number | { value: string | number | Record<string, string | number> }

export type SigilCssStyleObject = Record<string, unknown>

export interface SigilCssRecipe {
  base?: SigilCssStyleObject
  variants?: Record<string, Record<string, SigilCssStyleObject>>
  compoundVariants?: (Record<string, string> & { css?: SigilCssStyleObject })[]
  defaultVariants?: Record<string, string>
}

export interface SigilCssSlotRecipe {
  slots: string[]
  base?: Record<string, SigilCssStyleObject>
  variants?: Record<string, Record<string, Record<string, SigilCssStyleObject>>>
  compoundVariants?: (Record<string, string> & { css?: Record<string, SigilCssStyleObject> })[]
  defaultVariants?: Record<string, string>
}

export interface SigilCssConfig {
  /** Glob patterns (relative to cwd) scanned for style calls. */
  include?: string[]
  /** Directory for generated runtime and styles.css. Default styled-system. */
  outdir?: string
  /** Emit a minimal reset at the top of styles.css. Default true. */
  preflight?: boolean
  /** Collapse the stylesheet to one line. Default false. */
  minify?: boolean
  /** Emit tokens as CSS variables on :root so they can be overridden at
   *  runtime. Default true. */
  cssVariables?: boolean
  /** Prefix for emitted token variables. Default 's' (--s-colors-x). */
  varPrefix?: string
  /** min-width breakpoints, merged over sm/md/lg/xl/2xl defaults. */
  breakpoints?: Record<string, string>
  /** Named container widths, exposed as _cq<Name> conditions. */
  containers?: Record<string, string>
  /** Extra conditions. Values containing & are selector templates,
   *  values starting with @ are at-rule wrappers. */
  conditions?: Record<string, string>
  /** Named composite styles usable via the textStyle prop. */
  textStyles?: Record<string, SigilCssStyleObject>
  /** Named composite styles usable via the layerStyle prop. */
  layerStyles?: Record<string, SigilCssStyleObject>
  /** @keyframes blocks emitted into styles.css. */
  keyframes?: Record<string, Record<string, Record<string, string | number>>>
  /** Variant-driven style recipes, generated as functions returning a
   *  class string. */
  recipes?: Record<string, SigilCssRecipe>
  /** Multi-part recipes returning a class string per named slot. */
  slotRecipes?: Record<string, SigilCssSlotRecipe>
  /** Token groups. Leafs are raw values or { value } objects; a
   *  conditional { value: { base, _dark, md } } emits per-context
   *  variable overrides. */
  tokens?: {
    colors?: Record<string, SigilCssTokenValue | Record<string, unknown>>
    spacing?: Record<string, SigilCssTokenValue>
    sizes?: Record<string, SigilCssTokenValue>
    radii?: Record<string, SigilCssTokenValue>
    shadows?: Record<string, SigilCssTokenValue>
    fontSizes?: Record<string, SigilCssTokenValue>
    fontWeights?: Record<string, SigilCssTokenValue>
    fonts?: Record<string, SigilCssTokenValue>
    lineHeights?: Record<string, SigilCssTokenValue>
    letterSpacings?: Record<string, SigilCssTokenValue>
    zIndex?: Record<string, SigilCssTokenValue>
    opacity?: Record<string, SigilCssTokenValue>
    borderWidths?: Record<string, SigilCssTokenValue>
    [category: string]: Record<string, unknown> | undefined
  }
}

export declare function defineConfig(config: SigilCssConfig): SigilCssConfig
export declare function defineRecipe(recipe: SigilCssRecipe): SigilCssRecipe
export declare function defineSlotRecipe(recipe: SigilCssSlotRecipe): SigilCssSlotRecipe
