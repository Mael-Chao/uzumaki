import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTeam } from '../actions'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function StatsPage() {
  const team = await getTeam()
  if (!team) redirect('/dashboard')

  const supabase = await createClient()

  const [
    { count: totalEntries },
    { count: publishedEntries },
    { count: totalSubscribers },
    { data: entriesByTag },
  ] = await Promise.all([
    supabase.from('entries').select('*', { count: 'exact', head: true }).eq('team_id', team.id),
    supabase.from('entries').select('*', { count: 'exact', head: true }).eq('team_id', team.id).eq('published', true),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('team_id', team.id),
    supabase.from('entries').select('tag').eq('team_id', team.id).eq('published', true),
  ])

  const tagCounts = (entriesByTag ?? []).reduce((acc, entry) => {
    if (!entry.tag) return acc
    acc[entry.tag] = (acc[entry.tag] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const stats = [
    { label: 'Total entries', value: totalEntries ?? 0 },
    { label: 'Published', value: publishedEntries ?? 0 },
    { label: 'Drafts', value: (totalEntries ?? 0) - (publishedEntries ?? 0) },
    { label: 'Subscribers', value: totalSubscribers ?? 0 },
  ]

  const tagStyles: Record<string, string> = {
    feature: 'bg-emerald-100 text-emerald-700',
    fix: 'bg-red-100 text-red-700',
    improvement: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Stats</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your changelog</p>
      </div>

      <Separator />

      {/* Numbers */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* By tag */}
      {Object.keys(tagCounts).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium">Entries by tag</h2>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(tagCounts).map(([tag, count]) => (
              <div
                key={tag}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${tagStyles[tag] ?? 'bg-muted text-muted-foreground'}`}
              >
                <span>{tag}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}