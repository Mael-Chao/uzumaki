import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { EntryContent } from '../entry-content'
import Link from 'next/link'

const tagStyles: Record<string, string> = {
  feature: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  fix: 'bg-red-100 text-red-700 hover:bg-red-100',
  improvement: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const supabase = await createClient()

  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!team) notFound()

  const { data: entry } = await supabase
    .from('entries')
    .select('*')
    .eq('id', id)
    .eq('team_id', team.id)
    .eq('published', true)
    .single()

  if (!entry) notFound()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">

        <Link
          href={`/${slug}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {team.name} changelog
        </Link>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            {entry.tag && (
              <Badge className={`text-xs font-medium ${tagStyles[entry.tag]}`}>
                {entry.tag}
              </Badge>
            )}
            {entry.version && (
              <span className="text-xs text-muted-foreground font-mono">
                {entry.version}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight">{entry.title}</h1>

          <p className="text-sm text-muted-foreground">
            {formatDate(entry.published_at)}
          </p>

          <Separator />

          <EntryContent html={entry.content} full />
        </div>

      </div>
    </div>
  )
}