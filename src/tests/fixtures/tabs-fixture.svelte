<script lang="ts">
  import { Tabs } from '../../lib/index.js'

  let { value = $bindable('a') }: { value?: string } = $props()
</script>

<Tabs.Root bind:value>
  <Tabs.List>
    <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
    <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
    <Tabs.Trigger value="c" disabled>Tab C</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="a">Panel A</Tabs.Content>
  <Tabs.Content value="b">Panel B</Tabs.Content>
  <Tabs.Content value="c">Panel C</Tabs.Content>
</Tabs.Root>
