<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { Description as DialogDescription } from '../dialog/index.js'

  export interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
    children?: Snippet
  }

  let { children, ...rest }: Props = $props()
</script>

<DialogDescription {...rest}>{@render children?.()}</DialogDescription>
