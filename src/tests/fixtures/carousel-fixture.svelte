<script lang="ts">
  import { Carousel } from '../../lib/carousel/index.js'
  let { index = $bindable(0), loop = true } = $props()
</script>

<Carousel.Root bind:index {loop}>
  <Carousel.Item><p>First</p></Carousel.Item>
  <Carousel.Item><p>Second</p></Carousel.Item>
  <Carousel.Item><p>Third</p></Carousel.Item>
</Carousel.Root>
