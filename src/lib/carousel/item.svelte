<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getCarousel } from './ctx.js'

  export interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const ctx = getCarousel()
  const slot = ctx.register()

  $effect(() => () => ctx.unregister(slot))
</script>

<div
  class={cn('sig-carousel-item', className)}
  role="group"
  aria-roledescription="slide"
  aria-label="Slide {slot + 1} of {ctx.count}"
  {...rest}
>
  {@render children?.()}
</div>
