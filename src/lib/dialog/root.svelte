<script lang="ts">
  import type { Snippet } from 'svelte'
  import { setDialogContext, type DialogContext } from './ctx.js'

  interface Props {
    open?: boolean
    onOpenChange?: ((open: boolean) => void) | undefined
    children?: Snippet
  }

  let { open = $bindable(false), onOpenChange, children }: Props = $props()
  const id = $props.id()

  const ctx: DialogContext = {
    get open() {
      return open
    },
    set open(value: boolean) {
      open = value
      onOpenChange?.(value)
    },
    titleId: `${id}-title`,
    descriptionId: `${id}-description`
  }
  setDialogContext(ctx)
</script>

{@render children?.()}
