<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { Close as DialogClose } from '../dialog/index.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<DialogClose class={cn('sig-btn sig-alert-cancel', className)} data-variant="secondary" {...rest}>
  {children ? undefined : 'Cancel'}{@render children?.()}
</DialogClose>
