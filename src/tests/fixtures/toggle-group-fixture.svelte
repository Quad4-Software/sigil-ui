<script lang="ts">
  import { ToggleGroup } from '../../lib/index.js'
  let { value = '', type = 'single' }: { value?: string | string[]; type?: 'single' | 'multiple' } =
    $props()
</script>

<ToggleGroup.Root bind:value {type}>
  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
</ToggleGroup.Root>
