<script lang="ts">
  import { HoverCard } from '../../lib/index.js'
  let { openDelay = 0, closeDelay = 0 }: { openDelay?: number; closeDelay?: number } = $props()
</script>

<HoverCard.Root {openDelay} {closeDelay}>
  <HoverCard.Trigger>@octocat</HoverCard.Trigger>
  <HoverCard.Content>Profile preview</HoverCard.Content>
</HoverCard.Root>
