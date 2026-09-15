<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends HTMLAttributes<HTMLTableSectionElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<tbody class={cn('sig-table-body', className)} {...rest}>
  {@render children?.()}
</tbody>
