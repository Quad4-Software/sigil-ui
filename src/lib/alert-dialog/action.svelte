<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { Close as DialogClose } from '../dialog/index.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    tone?: 'primary' | 'danger'
    children?: Snippet
  }

  let { tone = 'primary', class: className, children, ...rest }: Props = $props()
</script>

<DialogClose class={cn('sig-btn sig-alert-action', className)} data-variant={tone} {...rest}>
  {children ? undefined : 'Confirm'}{@render children?.()}
</DialogClose>
