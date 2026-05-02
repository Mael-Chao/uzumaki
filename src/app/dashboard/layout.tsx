import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: team } = await supabase
    .from('teams')
    .select('name, slug')
    .eq('owner_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">Uzumaki</span>
            {team && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">{team.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {team && (
            <a
                href={`/${team.slug}`}
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                View public page ↗
            </a>
            )}
            <Link
              href="/settings"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Settings
            </Link>
            <Link
              href="/dashboard/subscribers"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Subscribers
            </Link>
            <Link
              href="/dashboard/stats"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Stats
            </Link>
            <ThemeToggle />
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}