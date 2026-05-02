import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTeam, createTeam } from './actions'
import { Onboarding } from './onboarding'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const tagStyles: Record<string, string> = {
  feature: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  fix: 'bg-red-100 text-red-700 hover:bg-red-100',
  improvement: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
}

export default async function DashboardPage() {
  const team = await getTeam()
  if (!team) return <Onboarding createTeam={createTeam} />

  const supabase = await createClient()
  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .eq('team_id', team.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Entries</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {entries?.length ?? 0} total
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/new">New entry</Link>
        </Button>
      </div>

      <Separator />

      {!entries || entries.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted-foreground text-sm">No entries yet.</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/dashboard/new">Create your first entry</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y">
          {entries.map((entry) => (
            <div key={entry.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${entry.published ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{entry.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {entry.published
                      ? `Published ${formatDate(entry.published_at)}`
                      : `Draft · ${formatDate(entry.created_at)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {entry.tag && (
                  <Badge className={`text-xs ${tagStyles[entry.tag]}`}>
                    {entry.tag}
                  </Badge>
                )}
                {entry.version && (
                  <span className="text-xs text-muted-foreground font-mono">{entry.version}</span>
                )}
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/dashboard/${entry.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}