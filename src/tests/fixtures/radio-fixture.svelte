<script lang="ts">
  import { RadioGroup } from '../../lib/index.js'
  let { value = '' }: { value?: string } = $props()
</script>

<RadioGroup.Root bind:value>
  <RadioGroup.Item value="a">Option A</RadioGroup.Item>
  <RadioGroup.Item value="b">Option B</RadioGroup.Item>
  <RadioGroup.Item value="c">Option C</RadioGroup.Item>
</RadioGroup.Root>
