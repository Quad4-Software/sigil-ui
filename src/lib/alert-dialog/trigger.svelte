<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { Trigger as DialogTrigger } from '../dialog/index.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet
  }

  let { children, ...rest }: Props = $props()
</script>

<DialogTrigger {...rest}>{@render children?.()}</DialogTrigger>
