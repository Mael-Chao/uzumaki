import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: team } = await supabase
    .from('teams')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 })
  }

  const { data: entries } = await supabase
    .from('entries')
    .select('id, title, content, tag, version, published_at')
    .eq('team_id', team.id)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(10)

  return NextResponse.json(
    { team, entries },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  })
}