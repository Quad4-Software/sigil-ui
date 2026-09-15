<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    heading?: string
    children?: Snippet
  }

  let { heading, class: className, children, ...rest }: Props = $props()

  const id = $props.id()
</script>

<div
  role="group"
  aria-labelledby={heading ? `sig-command-group-${id}` : undefined}
  class={cn('sig-command-group', className)}
  {...rest}
>
  {#if heading}
    <div id="sig-command-group-{id}" class="sig-command-heading">{heading}</div>
  {/if}
  {@render children?.()}
</div>

<style>
  :global(.sig-command-heading) {
    padding: 0.375rem 0.625rem 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--sig-muted, #71717a);
  }
</style>
