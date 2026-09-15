<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getDialogContext } from './ctx.js'

  interface Props extends HTMLAttributes<HTMLParagraphElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const ctx = getDialogContext()
</script>

<p id={ctx.descriptionId} class={cn('sig-dialog-description', className)} {...rest}>
  {@render children?.()}
</p>

<style>
  :global(.sig-dialog-description) {
    margin: 0 0 1rem;
    color: var(--sig-muted, #71717a);
    font-size: 0.875rem;
    line-height: 1.5;
  }
</style>
