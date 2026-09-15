<script lang="ts" generics="T extends Record<string, unknown>">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Column {
    key: string
    label: string
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
    cell?: Snippet<[T]>
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    columns: Column[]
    rows: T[]
    caption?: string | undefined
    empty?: string
  }

  let { columns, rows, caption, empty = 'No data', class: className, ...rest }: Props = $props()

  let sortKey = $state<string | null>(null)
  let sortDir = $state<'asc' | 'desc'>('asc')

  const sorted = $derived.by(() => {
    const key = sortKey
    if (!key) return rows
    const dir = sortDir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av ?? '').localeCompare(String(bv ?? '')) * dir
    })
  })

  function sortBy(col: Column) {
    if (!col.sortable) return
    if (sortKey === col.key) {
      if (sortDir === 'asc') sortDir = 'desc'
      else sortKey = null
    } else {
      sortKey = col.key
      sortDir = 'asc'
    }
  }

  const sortLabel = (col: Column) =>
    sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
</script>

<div class={cn('sig-datatable', className)} {...rest}>
  <table>
    {#if caption}<caption class="sig-datatable-caption">{caption}</caption>{/if}
    <thead>
      <tr>
        {#each columns as col (col.key)}
          <th
            scope="col"
            data-align={col.align}
            aria-sort={col.sortable ? sortLabel(col) : undefined}
          >
            {#if col.sortable}
              <button type="button" class="sig-datatable-sort" onclick={() => sortBy(col)}>
                {col.label}
                <span
                  class="sig-datatable-dir"
                  data-dir={sortKey === col.key ? sortDir : 'none'}
                  aria-hidden="true"
                ></span>
              </button>
            {:else}
              {col.label}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each sorted as row, i (i)}
        <tr>
          {#each columns as col (col.key)}
            <td data-align={col.align}>
              {#if col.cell}
                {@render col.cell(row)}
              {:else}
                {row[col.key]}
              {/if}
            </td>
          {/each}
        </tr>
      {:else}
        <tr>
          <td colspan={columns.length} class="sig-datatable-empty">{empty}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  :global(.sig-datatable) {
    overflow-x: auto;
    border: 1px solid var(--sig-border, #e4e4e7);
    border-radius: var(--sig-radius, 0.375rem);
  }

  :global(.sig-datatable table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  :global(.sig-datatable-caption) {
    padding: 0.75rem 1rem;
    text-align: left;
    color: var(--sig-muted, #71717a);
    font-size: 0.8125rem;
  }

  :global(.sig-datatable th) {
    padding: 0.625rem 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.8125rem;
    color: var(--sig-muted, #71717a);
    border-bottom: 1px solid var(--sig-border, #e4e4e7);
    background: var(--sig-surface, #f4f4f5);
  }

  :global(.sig-datatable td) {
    padding: 0.625rem 1rem;
    border-bottom: 1px solid var(--sig-border, #e4e4e7);
    color: var(--sig-fg, #18181b);
  }

  :global(.sig-datatable tbody tr:last-child td) {
    border-bottom: none;
  }

  :global(.sig-datatable tbody tr:hover td) {
    background: var(--sig-surface, #f4f4f5);
  }

  :global(.sig-datatable [data-align='center']) {
    text-align: center;
  }

  :global(.sig-datatable [data-align='right']) {
    text-align: right;
  }

  :global(.sig-datatable-sort) {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }

  :global(.sig-datatable-dir) {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 5px solid var(--sig-muted, #71717a);
    opacity: 0.35;
  }

  :global(.sig-datatable-dir[data-dir='asc']) {
    opacity: 1;
  }

  :global(.sig-datatable-dir[data-dir='desc']) {
    opacity: 1;
    transform: rotate(180deg);
  }

  :global(.sig-datatable-empty) {
    padding: 2rem 1rem;
    text-align: center;
    color: var(--sig-muted, #71717a);
  }
</style>
