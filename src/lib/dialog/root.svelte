<script lang="ts">
  import type { Snippet } from 'svelte'
  import { setDialogContext, type DialogContext } from './ctx.js'

  interface Props {
    open?: boolean
    children?: Snippet
  }

  let { open = $bindable(false), children }: Props = $props()
  const id = $props.id()

  const ctx: DialogContext = {
    get open() {
      return open
    },
    set open(value: boolean) {
      open = value
    },
    titleId: `${id}-title`,
    descriptionId: `${id}-description`
  }
  setDialogContext(ctx)
</script>

{@render children?.()}
