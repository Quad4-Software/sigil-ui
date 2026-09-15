<script lang="ts">
  import { Stepper } from '../../lib/index.js'
  let { step = 0 }: { step?: number } = $props()
</script>

<Stepper.Root bind:step>
  <Stepper.Item title="Account" />
  <Stepper.Item title="Profile" />
  <Stepper.Item title="Done" />
</Stepper.Root>
