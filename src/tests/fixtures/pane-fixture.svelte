<script lang="ts">
  import { Pane, PaneGroup, PaneResizer } from '../../lib/index.js'

  let {
    direction = 'horizontal',
    onLayout
  }: {
    direction?: 'horizontal' | 'vertical'
    onLayout?: (sizes: number[]) => void
  } = $props()
</script>

<PaneGroup {direction} {onLayout} data-testid="group">
  <Pane defaultSize={40} minSize={20} maxSize={80} data-testid="pane-a">A</Pane>
  <PaneResizer data-testid="resizer" />
  <Pane minSize={10} data-testid="pane-b">B</Pane>
</PaneGroup>
