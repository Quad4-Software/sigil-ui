<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { Title as DialogTitle } from '../dialog/index.js'

  export interface Props extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> {
    children?: Snippet
  }

  let { children, ...rest }: Props = $props()
</script>

<DialogTitle {...rest}>{@render children?.()}</DialogTitle>
