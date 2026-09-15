<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<ol class={cn('sig-timeline', className)} {...rest}>
  {@render children?.()}
</ol>

<style>
  :global(.sig-timeline) {
    display: grid;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
