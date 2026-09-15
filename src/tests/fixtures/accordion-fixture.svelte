<script lang="ts">
  import { Accordion } from '../../lib/index.js'

  let { multiple = false }: { multiple?: boolean } = $props()
</script>

<Accordion.Root {multiple}>
  <Accordion.Item value="a">
    <Accordion.Trigger>Section A</Accordion.Trigger>
    <Accordion.Content>Content A</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="b">
    <Accordion.Trigger>Section B</Accordion.Trigger>
    <Accordion.Content>Content B</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
