import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { EntryContent } from './entry-content'
import Link from 'next/link'
import { SubscribeForm } from './subscribe-form'
import { ThemeToggle } from '@/components/theme-toggle'


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

export default async function PublicChangelogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!team) notFound()

  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .eq('team_id', team.id)
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          <p className="text-muted-foreground mt-2">Changelog</p>
          <div className="max-w-3xl mx-auto px-6 py-4 flex justify-end">
            <ThemeToggle />
          </div>
          <Separator className="mt-6" />
        </div>

        <div className="mb-10">
          <SubscribeForm
            teamId={team.id}
            teamName={team.name}
            slug={slug}
          />
        </div>

        {/* Entries */}
        {!entries || entries.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-sm">No updates published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/${team.slug}/${entry.id}`}
                className="rounded-xl border bg-card p-6 flex flex-col gap-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between gap-2">
                  {entry.tag && (
                    <Badge className={`text-xs font-medium ${tagStyles[entry.tag]}`}>
                      {entry.tag}
                    </Badge>
                  )}
                  {entry.version && (
                    <span className="text-xs text-muted-foreground font-mono ml-auto">
                      {entry.version}
                    </span>
                  )}
                </div>

                <h2 className="font-semibold text-base leading-snug">{entry.title}</h2>

                <EntryContent html={entry.content} />

                <p className="text-xs text-muted-foreground mt-auto pt-2">
                  {formatDate(entry.published_at)}
                </p>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}