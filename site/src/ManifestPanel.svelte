<script lang="ts">
  import { manifest } from 'sigil-ui'
  import { css } from '../styled-system/css'

  // renders the manifest entry for one or more component names: prop table,
  // class hooks and data attributes. Shared by Spec cards and the API section
  let { for: names }: { for: string | string[] } = $props()

  const wanted = $derived((Array.isArray(names) ? names : [names]).map((n) => n.toLowerCase()))
  const entries = $derived(manifest.components.filter((c) => wanted.includes(c.name.toLowerCase())))
</script>

{#each entries as entry (entry.name)}
  <div class={css({ overflowX: 'auto' })}>
    {#if entries.length > 1}
      <p
        class={css({
          mb: '1',
          fontFamily: 'mono',
          fontSize: 'xs',
          fontWeight: 'medium',
          color: 'sig.accent'
        })}
      >
        {entry.name}
      </p>
    {/if}
    <table
      class={css({ w: 'full', textAlign: 'left', fontSize: 'sm', borderCollapse: 'collapse' })}
    >
      <thead class={css({ color: 'sig.muted' })}>
        <tr>
          <th class={css({ py: '1', pr: '4', fontWeight: 'medium' })}>prop</th>
          <th class={css({ py: '1', pr: '4', fontWeight: 'medium' })}>type</th>
          <th class={css({ py: '1', fontWeight: 'medium' })}>description</th>
        </tr>
      </thead>
      <tbody>
        {#each entry.props as prop, i (i)}
          <tr
            class={css({
              borderTop: '1px solid',
              borderColor: 'color-mix(in oklab, var(--sig-fg) 8%, transparent)'
            })}
          >
            <td class={css({ py: '1.5', pr: '4', fontFamily: 'mono', fontSize: 'xs' })}
              >{prop.name}{prop.bindable ? ' (bindable)' : ''}</td
            >
            <td
              class={css({
                py: '1.5',
                pr: '4',
                fontFamily: 'mono',
                fontSize: 'xs',
                color: 'sig.muted',
                whiteSpace: 'nowrap'
              })}>{prop.type}</td
            >
            <td class={css({ py: '1.5', color: 'sig.muted' })}>{prop.description}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <p class={css({ mt: '2', fontFamily: 'mono', fontSize: 'xs', color: 'sig.muted' })}>
      {entry.classes.join(' ')}
    </p>
    {#if entry.dataAttributes.length}
      <p class={css({ mt: '1', fontFamily: 'mono', fontSize: 'xs', color: 'sig.muted' })}>
        {entry.dataAttributes.join(' ')}
      </p>
    {/if}
  </div>
{/each}
