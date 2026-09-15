<script lang="ts">
  import type { Snippet } from 'svelte'
  import { setSheetContext, type SheetContext } from './ctx.js'

  export interface Props {
    open?: boolean
    children?: Snippet
  }

  let { open = $bindable(false), children }: Props = $props()
  const id = $props.id()

  const ctx: SheetContext = {
    get open() {
      return open
    },
    set open(value: boolean) {
      open = value
    },
    titleId: `${id}-title`,
    descriptionId: `${id}-description`
  }
  setSheetContext(ctx)
</script>

{@render children?.()}
