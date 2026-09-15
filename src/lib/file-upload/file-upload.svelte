<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> {
    files?: File[]
    accept?: string
    multiple?: boolean
    disabled?: boolean
    label?: string
    hint?: string
    onFiles?: (files: File[]) => void
    children?: Snippet
  }

  let {
    files = $bindable<File[]>([]),
    accept,
    multiple = false,
    disabled = false,
    label = 'Drop files here or click to browse',
    hint,
    onFiles,
    class: className,
    children,
    ...rest
  }: Props = $props()

  let input: HTMLInputElement | undefined = $state()
  let dragover = $state(false)

  function commit(list: File[]) {
    files = list
    onFiles?.(list)
  }

  function receive(list: FileList | File[] | null) {
    if (!list || disabled) return
    const next = multiple ? [...files, ...list] : [...list].slice(0, 1)
    commit(next)
  }

  function remove(index: number) {
    if (disabled) return
    commit(files.filter((_, i) => i !== index))
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
</script>

<div class={cn('sig-file-upload', className)} {...rest}>
  <button
    type="button"
    class="sig-dropzone"
    data-dragover={dragover ? '' : undefined}
    data-disabled={disabled ? '' : undefined}
    {disabled}
    aria-label={label}
    onclick={() => input?.click()}
    ondragover={(event) => {
      if (disabled) return
      event.preventDefault()
      dragover = true
    }}
    ondragleave={() => (dragover = false)}
    ondrop={(event) => {
      event.preventDefault()
      dragover = false
      receive(event.dataTransfer?.files ?? null)
    }}
  >
    {#if children}
      {@render children()}
    {:else}
      <span class="sig-dropzone-label">{label}</span>
      {#if hint}<span class="sig-dropzone-hint">{hint}</span>{/if}
    {/if}
  </button>
  <input
    bind:this={input}
    type="file"
    class="sig-file-input"
    {accept}
    {multiple}
    {disabled}
    tabindex="-1"
    aria-hidden="true"
    onchange={(event) => receive(event.currentTarget.files)}
  />
  {#if files.length > 0}
    <ul class="sig-file-list">
      {#each files as file, i (i)}
        <li class="sig-file">
          <span class="sig-file-name">{file.name}</span>
          <span class="sig-file-size">{formatSize(file.size)}</span>
          <button
            type="button"
            class="sig-file-remove"
            aria-label="Remove {file.name}"
            {disabled}
            onclick={() => remove(i)}>&times;</button
          >
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  :global(.sig-file-upload) {
    display: grid;
    gap: 0.5rem;
  }

  :global(.sig-dropzone) {
    display: grid;
    place-items: center;
    gap: 0.25rem;
    padding: 1.5rem;
    border: 1px dashed var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    font: inherit;
    cursor: pointer;
    text-align: center;
  }

  :global(.sig-dropzone:hover:not(:disabled)) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-dropzone[data-dragover]) {
    border-color: var(--sig-accent, #4f46e5);
    background: var(--sig-surface, #f4f4f5);
  }

  :global(.sig-dropzone:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
  }

  :global(.sig-dropzone[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.sig-dropzone-label) {
    font-size: 0.875rem;
    font-weight: 500;
  }

  :global(.sig-dropzone-hint) {
    font-size: 0.75rem;
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-file-input) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  :global(.sig-file-list) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.25rem;
  }

  :global(.sig-file) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.625rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    font-size: 0.8125rem;
  }

  :global(.sig-file-name) {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :global(.sig-file-size) {
    color: var(--sig-muted, #71717a);
    flex-shrink: 0;
  }

  :global(.sig-file-remove) {
    display: inline-flex;
    padding: 0;
    border: none;
    background: none;
    color: var(--sig-muted, #71717a);
    font: inherit;
    cursor: pointer;
  }

  :global(.sig-file-remove:hover) {
    color: var(--sig-danger, #dc2626);
  }
</style>
