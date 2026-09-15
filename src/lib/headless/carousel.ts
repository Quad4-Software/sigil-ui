// Carousel controller for .sig-carousel markup: translates
// .sig-carousel-track by index, wires .sig-carousel-prev/.sig-carousel-next
// and .sig-carousel-dot indicators. Framework-free.

import { destroyAll, isDisabled, on } from './dom.js'

export interface CarouselOptions {
  index?: number
  loop?: boolean
  onChange?: (index: number) => void
}

export interface CarouselController {
  index: number
  count: number
  goTo(i: number): void
  destroy(): void
}

export function attachCarousel(
  root: HTMLElement,
  options: CarouselOptions = {}
): CarouselController {
  const foundTrack = root.querySelector<HTMLElement>('.sig-carousel-track')
  const slides = [...root.querySelectorAll<HTMLElement>('.sig-carousel-item')]
  if (!foundTrack || !slides.length)
    throw new Error(
      'sigil: attachCarousel needs .sig-carousel-track with .sig-carousel-item slides'
    )
  const track = foundTrack

  const loop = options.loop ?? true
  const count = slides.length
  let index = options.index ?? 0
  const prev = root.querySelector<HTMLElement>('.sig-carousel-prev')
  const next = root.querySelector<HTMLElement>('.sig-carousel-next')
  let dots = [...root.querySelectorAll<HTMLElement>('.sig-carousel-dot')]
  const dotsWrap = root.querySelector<HTMLElement>('.sig-carousel-dots')

  if (!dots.length && dotsWrap) {
    for (let i = 0; i < count; i++) {
      const d = document.createElement('button')
      d.type = 'button'
      d.className = 'sig-carousel-dot'
      d.setAttribute('role', 'tab')
      d.setAttribute('aria-label', `Slide ${i + 1}`)
      dotsWrap.append(d)
    }
    dots = [...dotsWrap.querySelectorAll<HTMLElement>('.sig-carousel-dot')]
  }

  function apply() {
    track.style.transform = `translateX(-${index * 100}%)`
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)))
    slides.forEach((s, i) => s.setAttribute('aria-label', `Slide ${i + 1} of ${count}`))
    if (prev instanceof HTMLButtonElement) prev.disabled = !loop && index === 0
    if (next instanceof HTMLButtonElement) next.disabled = !loop && index === count - 1
  }

  function goTo(i: number) {
    const target = loop ? ((i % count) + count) % count : Math.min(count - 1, Math.max(0, i))
    if (target === index) return
    index = target
    apply()
    options.onChange?.(index)
  }

  const unsubs = [
    ...(prev ? [on(prev, 'click', () => goTo(index - 1))] : []),
    ...(next ? [on(next, 'click', () => goTo(index + 1))] : []),
    ...dots.map((d, i) => on(d, 'click', () => !isDisabled(d) && goTo(i))),
    on(root, 'keydown', (event) => {
      if (event.key === 'ArrowLeft') goTo(index - 1)
      else if (event.key === 'ArrowRight') goTo(index + 1)
    })
  ]

  apply()

  return {
    get index() {
      return index
    },
    count,
    goTo,
    destroy: destroyAll(...unsubs)
  }
}
