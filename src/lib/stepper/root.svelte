<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setStepper } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLOListElement>, 'children' | 'onchange'> {
    step?: number
    onStepChange?: (step: number) => void
    children?: Snippet
  }

  let { step = $bindable(0), onStepChange, class: className, children, ...rest }: Props = $props()

  let registered = 0

  setStepper({
    get step() {
      return step
    },
    set step(next: number) {
      step = next
      onStepChange?.(next)
    },
    count: () => registered,
    register() {
      return registered++
    }
  })
</script>

<ol class={cn('sig-stepper', className)} {...rest}>
  {@render children?.()}
</ol>

<style>
  :global(.sig-stepper) {
    display: flex;
    align-items: flex-start;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
  }
</style>
