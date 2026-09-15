<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLElement> {
    size?: 'sm' | 'md' | 'lg'
    /** Flip body, muted and border colors for dark panels on a light page. */
    invert?: boolean
    children?: Snippet
  }

  let { size, invert = false, children, class: className, ...rest }: Props = $props()
</script>

<div
  class={cn(
    'sig-prose',
    size === 'sm' && 'sig-prose-sm',
    size === 'lg' && 'sig-prose-lg',
    invert && 'sig-prose-invert',
    className
  )}
  {...rest}
>
  {@render children?.()}
</div>
