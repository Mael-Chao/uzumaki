import { notFound } from 'next/navigation'
import { getEntry, updateEntry, deleteEntry } from '../../actions'
import { EntryForm } from '../../_components/entry-form'

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const entry = await getEntry(id)
  if (!entry) notFound()

  return (
    <EntryForm
      action={updateEntry}
      deleteAction={deleteEntry}
      entry={entry}
    />
  )
}