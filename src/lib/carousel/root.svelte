<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setCarousel } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    index?: number
    loop?: boolean
    label?: string
    controls?: boolean
    indicators?: boolean
    onChange?: (index: number) => void
    children?: Snippet
  }

  let {
    index = $bindable(0),
    loop = true,
    label = 'Carousel',
    controls = true,
    indicators = true,
    onChange,
    class: className,
    children,
    ...rest
  }: Props = $props()

  let count = $state(0)

  function goTo(i: number) {
    if (count === 0) return
    const next = loop ? ((i % count) + count) % count : Math.min(count - 1, Math.max(0, i))
    if (next === index) return
    index = next
    onChange?.(index)
  }

  setCarousel({
    get index() {
      return index
    },
    get count() {
      return count
    },
    register() {
      return count++
    },
    unregister() {
      count = Math.max(0, count - 1)
      if (index >= count) index = Math.max(0, count - 1)
    },
    goTo
  })
</script>

<div
  class={cn('sig-carousel', className)}
  role="region"
  aria-roledescription="carousel"
  aria-label={label}
  {...rest}
>
  <div class="sig-carousel-viewport">
    <div class="sig-carousel-track" style="transform: translateX(-{index * 100}%)">
      {@render children?.()}
    </div>
  </div>
  {#if controls && count > 1}
    <button
      type="button"
      class="sig-carousel-btn sig-carousel-prev"
      aria-label="Previous slide"
      disabled={!loop && index === 0}
      onclick={() => goTo(index - 1)}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg
      >
    </button>
    <button
      type="button"
      class="sig-carousel-btn sig-carousel-next"
      aria-label="Next slide"
      disabled={!loop && index === count - 1}
      onclick={() => goTo(index + 1)}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg
      >
    </button>
  {/if}
  {#if indicators && count > 1}
    <div class="sig-carousel-dots" role="tablist" aria-label="Slides">
      {#each Array.from({ length: count }, (_, i) => i) as i (i)}
        <button
          type="button"
          class="sig-carousel-dot"
          role="tab"
          aria-selected={i === index}
          aria-label="Slide {i + 1}"
          onclick={() => goTo(i)}
        ></button>
      {/each}
    </div>
  {/if}
</div>

<style>
  :global(.sig-carousel) {
    position: relative;
    width: 100%;
  }

  :global(.sig-carousel-viewport) {
    overflow: hidden;
    border-radius: var(--sig-radius, 0.375rem);
  }

  :global(.sig-carousel-track) {
    display: flex;
    transition: transform 300ms ease;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-carousel-track) {
      transition: none;
    }
  }

  :global(.sig-carousel-item) {
    flex: 0 0 100%;
    min-width: 0;
  }

  :global(.sig-carousel-btn) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: 999px;
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    cursor: pointer;
    box-shadow: var(--sig-shadow, 0 1px 3px rgb(0 0 0 / 0.08));
  }

  :global(.sig-carousel-btn:hover:not(:disabled)) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-carousel-btn:disabled) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :global(.sig-carousel-prev) {
    left: 0.5rem;
  }

  :global(.sig-carousel-next) {
    right: 0.5rem;
  }

  :global(.sig-carousel-dots) {
    display: flex;
    justify-content: center;
    gap: 0.375rem;
    margin-top: 0.5rem;
  }

  :global(.sig-carousel-dot) {
    width: 0.5rem;
    height: 0.5rem;
    border: none;
    border-radius: 999px;
    background: var(--sig-border, #d4d4d8);
    cursor: pointer;
    padding: 0;
  }

  :global(.sig-carousel-dot[aria-selected='true']) {
    background: var(--sig-accent, #4f46e5);
  }
</style>
