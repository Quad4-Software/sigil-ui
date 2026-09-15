<script lang="ts">
  import type { Snippet } from 'svelte'

  let { title, children }: { title?: string; children?: Snippet } = $props()
  let copied = $state(false)

  async function copy() {
    const text = root?.innerText ?? ''
    await navigator.clipboard.writeText(text)
    copied = true
    setTimeout(() => (copied = false), 1500)
  }

  let root = $state<HTMLElement>()
</script>

<figure class="overflow-hidden rounded-sig border border-sig-border">
  {#if title}
    <figcaption
      class="flex items-center justify-between border-b border-sig-border bg-sig-surface px-3 py-1.5 text-xs text-sig-muted"
    >
      <span>{title}</span>
      <button class="cursor-pointer text-xs hover:text-sig-fg" onclick={copy}>
        {copied ? 'copied' : 'copy'}
      </button>
    </figcaption>
  {/if}
  <pre
    bind:this={root}
    class="overflow-x-auto bg-sig-surface p-4 text-sm leading-6">{@render children?.()}</pre>
</figure>
