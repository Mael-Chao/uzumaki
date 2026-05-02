import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function UnsubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ email?: string }>
}) {
  const { slug } = await params
  const { email } = await searchParams

  if (!email) {
    return <UnsubscribeLayout slug={slug} status="invalid" />
  }

  const supabase = await createClient()

  const { data: team } = await supabase
    .from('teams')
    .select('id, name')
    .eq('slug', slug)
    .single()

  if (!team) {
    return <UnsubscribeLayout slug={slug} status="invalid" />
  }

  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('team_id', team.id)
    .eq('email', email)

  return (
    <UnsubscribeLayout
      slug={slug}
      status={error ? 'error' : 'success'}
      teamName={team.name}
    />
  )
}

function UnsubscribeLayout({
  slug,
  status,
  teamName,
}: {
  slug: string
  status: 'success' | 'error' | 'invalid'
  teamName?: string
}) {
  const messages = {
    success: {
      title: 'Unsubscribed',
      description: `You won't receive updates from ${teamName} anymore.`,
    },
    error: {
      title: 'Something went wrong',
      description: 'We could not process your request. Please try again.',
    },
    invalid: {
      title: 'Invalid link',
      description: 'This unsubscribe link is not valid.',
    },
  }

  const { title, description } = messages[status]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-3 max-w-sm">
        <p className="text-2xl">{status === 'success' ? '✓' : '✕'}</p>
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Link
          href={`/${slug}`}
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors block pt-2"
        >
          Back to changelog
        </Link>
      </div>
    </div>
  )
}