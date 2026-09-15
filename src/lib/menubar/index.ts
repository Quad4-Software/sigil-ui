import Root from './root.svelte'
import Menu from './menu.svelte'
import Trigger from './trigger.svelte'
import Content from './content.svelte'
import Item from './item.svelte'
import Separator from './separator.svelte'

export const Menubar = { Root, Menu, Trigger, Content, Item, Separator }
export {
  Root as MenubarRoot,
  Menu as MenubarMenu,
  Trigger as MenubarTrigger,
  Content as MenubarContent,
  Item as MenubarItem,
  Separator as MenubarSeparator
}
