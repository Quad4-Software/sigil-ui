import { describe, expect, it } from 'vitest'
import { findOverflows, measure, tagOverflows } from '../lib/index.js'

describe('findOverflows', () => {
  it('reports elements whose content exceeds their box', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    Object.defineProperty(el, 'scrollWidth', { value: 200 })
    Object.defineProperty(el, 'clientWidth', { value: 100 })
    const issues = findOverflows(document.body)
    expect(issues.some((i) => i.el === el)).toBe(true)
    el.remove()
  })

  it('skips elements under data-sig-inspect-ignore', () => {
    const wrap = document.createElement('div')
    wrap.setAttribute('data-sig-inspect-ignore', '')
    const el = document.createElement('div')
    wrap.appendChild(el)
    document.body.appendChild(wrap)
    Object.defineProperty(el, 'scrollWidth', { value: 200 })
    Object.defineProperty(el, 'clientWidth', { value: 100 })
    expect(findOverflows(document.body).every((i) => i.el !== el)).toBe(true)
    wrap.remove()
  })

  it('skips hidden elements and document roots', () => {
    const el = document.createElement('div')
    el.style.display = 'none'
    document.body.appendChild(el)
    Object.defineProperty(el, 'scrollWidth', { value: 200 })
    Object.defineProperty(el, 'clientWidth', { value: 100 })
    expect(findOverflows(document.body).every((i) => i.el !== el)).toBe(true)
    el.remove()
  })

  it('reports y-axis and both-axis overflow', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    Object.defineProperty(el, 'scrollHeight', { value: 200 })
    Object.defineProperty(el, 'clientHeight', { value: 100 })
    const issue = findOverflows(document.body).find((i) => i.el === el)
    expect(issue?.axis).toBe('y')
    Object.defineProperty(el, 'scrollWidth', { value: 200 })
    Object.defineProperty(el, 'clientWidth', { value: 100 })
    const both = findOverflows(document.body).find((i) => i.el === el)
    expect(both?.axis).toBe('both')
    el.remove()
  })

  it('does not report elements with scroll or auto overflow', () => {
    const el = document.createElement('div')
    el.style.overflow = 'auto'
    document.body.appendChild(el)
    Object.defineProperty(el, 'scrollWidth', { value: 200 })
    Object.defineProperty(el, 'clientWidth', { value: 100 })
    expect(findOverflows(document.body).every((i) => i.el !== el)).toBe(true)
    el.remove()
  })
})

describe('tagOverflows', () => {
  it('tags issues with data-sig-overflow and clears them', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    Object.defineProperty(el, 'scrollWidth', { value: 200 })
    Object.defineProperty(el, 'clientWidth', { value: 100 })
    const { issues, clear } = tagOverflows(document.body)
    expect(issues.length).toBeGreaterThan(0)
    expect(el).toHaveAttribute('data-sig-overflow')
    clear()
    expect(el).not.toHaveAttribute('data-sig-overflow')
    el.remove()
  })
})

describe('measure', () => {
  it('returns rect and spacing values', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    const box = measure(el)
    expect(box).toHaveProperty('width')
    expect(box).toHaveProperty('marginTop')
    expect(box).toHaveProperty('gap')
    el.remove()
  })
})
