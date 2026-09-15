<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import {
    Portal as DialogPortal,
    Overlay as DialogOverlay,
    Content as DialogContent
  } from '../dialog/index.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<DialogPortal>
  <DialogOverlay />
  <DialogContent role="alertdialog" class={cn('sig-alert-dialog', className)} {...rest}>
    {@render children?.()}
  </DialogContent>
</DialogPortal>
