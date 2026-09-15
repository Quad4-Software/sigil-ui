// Layout inspection helpers for humans and agents. The common failure
// modes when composing UI are silent overflow, wrong gaps, and margins
// collapsing differently than expected. These functions surface those
// as data instead of pixels you have to eyeball.

export interface OverflowIssue {
  el: Element
  axis: 'x' | 'y' | 'both'
  /** Pixels the content exceeds the element box on each axis. */
  deltaX: number
  deltaY: number
}

export interface BoxMeasure {
  width: number
  height: number
  top: number
  left: number
  right: number
  bottom: number
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  gap: number
  rowGap: number
  columnGap: number
}

const TOLERANCE = 1

function leaks(value: string) {
  // auto and scroll are intended clipping. visible paints outside the
  // box, hidden and clip silently truncate content.
  return value === 'visible' || value === 'hidden' || value === 'clip'
}

/** Elements whose content exceeds their box in a way that leaks or clips.
 * Skips hidden nodes, document roots, and data-sig-inspect-ignore trees. */
export function findOverflows(root: ParentNode = document.body): OverflowIssue[] {
  const issues: OverflowIssue[] = []
  for (const el of root.querySelectorAll('*')) {
    if (!(el instanceof HTMLElement)) continue
    if (el === document.documentElement || el === document.body) continue
    if (el.closest('[data-sig-inspect-ignore]')) continue
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden') continue
    const deltaX = el.scrollWidth - el.clientWidth
    const deltaY = el.scrollHeight - el.clientHeight
    // Some engines leave longhands at visible when the shorthand is set,
    // so fall back to the shorthand's first value when it is set.
    const short = style.overflow?.split(' ')[0]
    const ox =
      style.overflowX === 'visible' && short && short !== 'visible' ? short : style.overflowX
    const oy =
      style.overflowY === 'visible' && short && short !== 'visible' ? short : style.overflowY
    const x = deltaX > TOLERANCE && leaks(ox)
    const y = deltaY > TOLERANCE && leaks(oy)
    if (!x && !y) continue
    issues.push({
      el,
      axis: x && y ? 'both' : x ? 'x' : 'y',
      deltaX: Math.max(0, deltaX),
      deltaY: Math.max(0, deltaY)
    })
  }
  return issues
}

/** Sibling gap check: reports pairs whose actual gap differs from the
 * declared gap on the parent, which catches margin fights and extra
 * whitespace nodes. Only meaningful on flex/grid containers. */
export function measure(el: Element): BoxMeasure {
  const rect = el.getBoundingClientRect()
  const style = getComputedStyle(el)
  const px = (v: string) => Number.parseFloat(v) || 0
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    marginTop: px(style.marginTop),
    marginRight: px(style.marginRight),
    marginBottom: px(style.marginBottom),
    marginLeft: px(style.marginLeft),
    gap: px(style.gap),
    rowGap: px(style.rowGap),
    columnGap: px(style.columnGap)
  }
}

/** Tag overflowing elements with data-sig-overflow so GridOverlay (or any
 * stylesheet) can outline them. Returns a cleanup that removes the tags. */
export function tagOverflows(root: ParentNode = document.body): {
  issues: OverflowIssue[]
  clear: () => void
} {
  const issues = findOverflows(root)
  for (const issue of issues) issue.el.setAttribute('data-sig-overflow', issue.axis)
  return {
    issues,
    clear: () => {
      for (const issue of issues) issue.el.removeAttribute('data-sig-overflow')
    }
  }
}
