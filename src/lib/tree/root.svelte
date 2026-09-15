<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface TreeNode {
    id: string
    label: string
    disabled?: boolean
    children?: TreeNode[]
  }

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> {
    items: TreeNode[]
    selected?: string
    expanded?: string[]
    onSelect?: (node: TreeNode) => void
  }

  let {
    items,
    selected = $bindable(''),
    expanded = $bindable<string[]>([]),
    onSelect,
    class: className,
    onkeydown,
    ...rest
  }: Props = $props()

  function flatten(nodes: TreeNode[], open: string[], out: TreeNode[] = []) {
    for (const node of nodes) {
      out.push(node)
      if (node.children?.length && open.includes(node.id)) flatten(node.children, open, out)
    }
    return out
  }

  const visible = $derived(flatten(items, expanded))
  const activeId = $derived(selected || (visible[0]?.id ?? ''))

  function parentOf(nodes: TreeNode[], id: string, parent?: TreeNode): TreeNode | undefined {
    for (const node of nodes) {
      if (node.id === id) return parent
      const hit = node.children ? parentOf(node.children, id, node) : undefined
      if (hit) return hit
    }
    return undefined
  }

  function select(node: TreeNode) {
    if (node.disabled) return
    if (node.children?.length) {
      expanded = expanded.includes(node.id)
        ? expanded.filter((id) => id !== node.id)
        : [...expanded, node.id]
    }
    selected = node.id
    onSelect?.(node)
  }

  function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    onkeydown?.(event)
    const index = visible.findIndex((n) => n.id === activeId)
    const node = visible[index]
    if (!node) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      const next = visible[index + delta]
      if (next && !next.disabled) {
        selected = next.id
        onSelect?.(next)
      }
    } else if (event.key === 'ArrowRight') {
      if (node.children?.length && !expanded.includes(node.id)) {
        event.preventDefault()
        expanded = [...expanded, node.id]
      }
    } else if (event.key === 'ArrowLeft') {
      if (node.children?.length && expanded.includes(node.id)) {
        event.preventDefault()
        expanded = expanded.filter((id) => id !== node.id)
      } else {
        const parent = parentOf(items, node.id)
        if (parent) {
          event.preventDefault()
          selected = parent.id
        }
      }
    }
  }
</script>

{#snippet branch(nodes: TreeNode[], depth: number)}
  <ul role="group" class="sig-tree-level">
    {#each nodes as node (node.id)}
      <li role="none">
        <button
          type="button"
          role="treeitem"
          aria-expanded={node.children?.length ? expanded.includes(node.id) : undefined}
          aria-selected={activeId === node.id}
          aria-disabled={node.disabled || undefined}
          data-state={activeId === node.id ? 'selected' : 'idle'}
          data-disabled={node.disabled ? '' : undefined}
          class="sig-tree-item"
          style="--depth: {depth}"
          tabindex={activeId === node.id ? 0 : -1}
          onclick={() => select(node)}
        >
          {#if node.children?.length}
            <svg
              class="sig-tree-chevron"
              data-open={expanded.includes(node.id) ? '' : undefined}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg
            >
          {:else}
            <span class="sig-tree-chevron" aria-hidden="true"></span>
          {/if}
          {node.label}
        </button>
        {#if node.children?.length && expanded.includes(node.id)}
          {@render branch(node.children, depth + 1)}
        {/if}
      </li>
    {/each}
  </ul>
{/snippet}

<div
  role="tree"
  class={cn('sig-tree', className)}
  onkeydown={handleKeydown}
  tabindex="-1"
  {...rest}
>
  {@render branch(items, 0)}
</div>

<style>
  :global(.sig-tree) {
    font-size: 0.875rem;
    color: var(--sig-fg, #18181b);
  }

  :global(.sig-tree-level) {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  :global(.sig-tree-item) {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    width: 100%;
    padding: 0.25rem 0.5rem;
    padding-left: calc(0.5rem + var(--depth, 0) * 1rem);
    border: none;
    border-radius: var(--sig-radius, 0.375rem);
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  :global(.sig-tree-item:hover) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-tree-item[data-state='selected']) {
    background: var(--sig-surface, #f4f4f5);
    color: var(--sig-accent, #4f46e5);
    font-weight: 500;
  }

  :global(.sig-tree-item:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: -2px;
  }

  :global(.sig-tree-item[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.sig-tree-chevron) {
    display: inline-flex;
    width: 0.75rem;
    flex-shrink: 0;
    color: var(--sig-muted, #71717a);
    transition: transform 120ms;
  }

  :global(.sig-tree-chevron[data-open]) {
    transform: rotate(90deg);
  }
</style>
