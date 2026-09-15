<script lang="ts">
  import { Table } from '../../lib/index.js'
</script>

<Table.Root>
  <Table.Caption>Services</Table.Caption>
  <Table.Head>
    <Table.Row>
      <Table.H scope="col">Name</Table.H>
      <Table.H scope="col">Status</Table.H>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>api</Table.Cell>
      <Table.Cell>up</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>web</Table.Cell>
      <Table.Cell>down</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
