<script lang="ts">
  import { Combobox } from '../../lib/index.js'
  let { onSelect = () => undefined }: { onSelect?: (value: string) => void } = $props()
</script>

<Combobox.Root onValueChange={onSelect}>
  <Combobox.Input placeholder="Pick a fruit" />
  <Combobox.Content>
    <Combobox.Item value="apple">Apple</Combobox.Item>
    <Combobox.Item value="banana">Banana</Combobox.Item>
    <Combobox.Item value="cherry">Cherry</Combobox.Item>
    <Combobox.Empty>No fruit</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>
