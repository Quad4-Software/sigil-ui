<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export type ComparisonCell = boolean | string | number

  export interface ComparisonRow {
    /** Feature name in the first column. */
    label: string
    /** One cell per column. true renders a check, false a dash, anything else text. */
    cells: ComparisonCell[]
  }

  interface Props extends HTMLAttributes<HTMLTableElement> {
    /** Column headers, one per value in each row's cells. */
    columns: string[]
    rows: ComparisonRow[]
    /** Column index styled as the highlighted column. */
    highlight?: number
    /** Accessible caption; visually hidden, still announced. */
    label?: string
  }

  let { columns, rows, highlight, label, class: className, ...rest }: Props = $props()
</script>

<table class={cn('sig-compare', className)} {...rest}>
  {#if label}<caption class="sig-sr-only">{label}</caption>{/if}
  <thead>
    <tr>
      <th class="sig-compare-feature" scope="col"></th>
      {#each columns as col, i (i)}
        <th scope="col" data-highlight={i === highlight || undefined}>{col}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row (row.label)}
      <tr>
        <th class="sig-compare-feature" scope="row">{row.label}</th>
        {#each row.cells as cell, i (i)}
          <td data-highlight={i === highlight || undefined}>
            {#if cell === true}
              <svg
                class="sig-compare-yes"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"><path d="m5 13 4 4L19 7" /></svg
              ><span class="sig-sr-only">yes</span>
            {:else if cell === false}
              <svg
                class="sig-compare-no"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                aria-hidden="true"><path d="M6 12h12" /></svg
              ><span class="sig-sr-only">no</span>
            {:else}
              {cell}
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  :global(.sig-sr-only) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  :global(.sig-compare) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  :global(.sig-compare th),
  :global(.sig-compare td) {
    padding: 0.625rem 0.75rem;
    text-align: center;
    border-bottom: 1px solid var(--sig-border, #d4d4d8);
  }

  :global(.sig-compare thead th) {
    font-weight: 600;
    color: var(--sig-fg, #18181b);
  }

  :global(.sig-compare .sig-compare-feature) {
    text-align: left;
    font-weight: 500;
    color: var(--sig-fg, #18181b);
  }

  :global(.sig-compare thead .sig-compare-feature) {
    font-weight: 600;
  }

  :global(.sig-compare td) {
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-compare td[data-highlight]),
  :global(.sig-compare thead th[data-highlight]) {
    background: var(--sig-accent-muted, rgb(79 70 229 / 0.08));
    color: var(--sig-fg, #18181b);
  }

  :global(.sig-compare thead th[data-highlight]) {
    color: var(--sig-accent, #4f46e5);
  }

  :global(.sig-compare-yes) {
    color: var(--sig-success, #15803d);
    vertical-align: -0.2em;
  }

  :global(.sig-compare-no) {
    color: var(--sig-border, #d4d4d8);
    vertical-align: -0.15em;
  }
</style>
