import { getContext, setContext } from 'svelte'

export interface CarouselCtx {
  readonly index: number
  readonly count: number
  register(): number
  unregister(i: number): void
  goTo(i: number): void
}

const KEY = Symbol('sig-carousel')

export function setCarousel(ctx: CarouselCtx) {
  setContext(KEY, ctx)
}

export function getCarousel(): CarouselCtx {
  const ctx = getContext<CarouselCtx>(KEY)
  if (!ctx) throw new Error('sigil: Carousel.Item must be used inside Carousel.Root')
  return ctx
}
