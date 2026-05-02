import { createEntry } from '../actions'
import { EntryForm } from '../_components/entry-form'

export default function NewEntryPage() {
  return <EntryForm action={createEntry} />
}