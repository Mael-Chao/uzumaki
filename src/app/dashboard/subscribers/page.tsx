import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTeam } from '../actions'
import { Separator } from '@/components/ui/separator'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function SubscribersPage() {
  const team = await getTeam()
  if (!team) redirect('/dashboard')

  const supabase = await createClient()
  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('*')
    .eq('team_id', team.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Subscribers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {subscribers?.length ?? 0} total
          </p>
        </div>
      </div>

      <Separator />

      {!subscribers || subscribers.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted-foreground text-sm">No subscribers yet.</p>
        </div>
      ) : (
        <div className="divide-y">
          {subscribers.map((sub) => (
            <div key={sub.id} className="py-4 flex items-center justify-between gap-4">
              <p className="text-sm">{sub.email}</p>
              <p className="text-xs text-muted-foreground flex-shrink-0">
                {formatDate(sub.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}