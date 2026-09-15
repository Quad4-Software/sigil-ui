<script lang="ts">
  import { Pane, PaneGroup, PaneResizer } from '../../lib/index.js'
</script>

<PaneGroup direction="horizontal" data-testid="outer">
  <Pane defaultSize={30} data-testid="side">Sidebar</Pane>
  <PaneResizer />
  <Pane data-testid="main">
    <PaneGroup direction="vertical" data-testid="inner">
      <Pane minSize={30}>Editor</Pane>
      <PaneResizer />
      <Pane defaultSize={30}>Console</Pane>
    </PaneGroup>
  </Pane>
</PaneGroup>
