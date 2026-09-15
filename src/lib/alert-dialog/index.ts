import Root from './root.svelte'
import Trigger from './trigger.svelte'
import Content from './content.svelte'
import Title from './title.svelte'
import Description from './description.svelte'
import Cancel from './cancel.svelte'
import Action from './action.svelte'

export const AlertDialog = { Root, Trigger, Content, Title, Description, Cancel, Action }
export {
  Root as AlertDialogRoot,
  Trigger as AlertDialogTrigger,
  Content as AlertDialogContent,
  Title as AlertDialogTitle,
  Description as AlertDialogDescription,
  Cancel as AlertDialogCancel,
  Action as AlertDialogAction
}
