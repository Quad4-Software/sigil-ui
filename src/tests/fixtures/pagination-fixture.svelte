<script lang="ts">
  import { Pagination } from '../../lib/index.js'

  let { pages = 10 }: { pages?: number } = $props()
  let page = $state(1)
</script>

<Pagination bind:page {pages} />
<span data-testid="page">{page}</span>
