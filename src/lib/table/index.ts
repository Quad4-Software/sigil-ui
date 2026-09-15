import Root from './root.svelte'
import Head from './head.svelte'
import Body from './body.svelte'
import Row from './row.svelte'
import H from './h.svelte'
import Cell from './cell.svelte'
import Caption from './caption.svelte'

export const Table = { Root, Head, Body, Row, H, Cell, Caption }
export {
  Root as TableRoot,
  Head as TableHead,
  Body as TableBody,
  Row as TableRow,
  H as TableH,
  Cell as TableCell,
  Caption as TableCaption
}
