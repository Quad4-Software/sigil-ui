<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes, HTMLLabelAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface ControlProps {
    id: string
    'aria-describedby'?: string | undefined
    'aria-invalid'?: boolean | undefined
  }

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    label?: string | undefined
    hint?: string | undefined
    error?: string | undefined
    labelProps?: HTMLLabelAttributes | undefined
    children?: Snippet<[ControlProps]>
  }

  let { label, hint, error, labelProps, class: className, children, ...rest }: Props = $props()

  const uid = $props.id()
  const controlId = `${uid}-control`
  const hintId = `${uid}-hint`
  const errorId = `${uid}-error`

  const describedby = $derived(error ? errorId : hint ? hintId : undefined)
</script>

<div class={cn('sig-field', className)} {...rest}>
  {#if label}
    <label for={controlId} class="sig-field-label" {...labelProps}>{label}</label>
  {/if}
  {@render children?.({
    id: controlId,
    'aria-describedby': describedby,
    'aria-invalid': !!error || undefined
  })}
  {#if error}
    <p id={errorId} role="alert" class="sig-field-error">{error}</p>
  {:else if hint}
    <p id={hintId} class="sig-field-hint">{hint}</p>
  {/if}
</div>

<style>
  :global(.sig-field) {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  :global(.sig-field-label) {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--sig-fg, #18181b);
    cursor: pointer;
  }

  :global(.sig-field-hint) {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-field-error) {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--sig-danger, #dc2626);
  }
</style>
