'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { notifySubscribers } from '@/lib/notify-subscribers'

export async function createTeam(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: 'Slug only allows lowercase letters, numbers and hyphens' }
  }

  const { error } = await supabase.from('teams').insert({
    owner_id: user.id,
    name,
    slug,
  })

  if (error) {
    if (error.code === '23505') return { error: 'That slug is already taken' }
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function getTeam() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('teams')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  return data
}

export async function createEntry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!team) redirect('/dashboard')

  const published = formData.get('published') === 'true'

  const { data: entry, error } = await supabase
    .from('entries')
    .insert({
      team_id: team.id,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      version: formData.get('version') as string || null,
      tag: formData.get('tag') as string || null,
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  if (published && entry) {
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('email')
      .eq('team_id', team.id)

    if (subscribers?.length) {
      await notifySubscribers(subscribers, entry, team)
    }
  }

  redirect('/dashboard')
}

export async function updateEntry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string
  const published = formData.get('published') === 'true'

  const { data: existing } = await supabase
    .from('entries')
    .select('published, published_at, team_id')
    .eq('id', id)
    .single()

  const { data: entry, error } = await supabase
    .from('entries')
    .update({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      version: formData.get('version') as string || null,
      tag: formData.get('tag') as string || null,
      published,
      published_at: published && !existing?.published_at
        ? new Date().toISOString()
        : existing?.published_at,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  // Notificar solo si se está publicando por primera vez
  if (published && !existing?.published && entry) {
    const { data: team } = await supabase
      .from('teams')
      .select('*')
      .eq('id', existing.team_id)
      .single()

    if (team) {
      const { data: subscribers } = await supabase
        .from('subscribers')
        .select('email')
        .eq('team_id', team.id)

      if (subscribers?.length) {
        await notifySubscribers(subscribers, entry, team)
      }
    }
  }

  redirect('/dashboard')
}

export async function deleteEntry(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  await supabase.from('entries').delete().eq('id', id)
  redirect('/dashboard')
}

export async function getEntry(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('entries')
    .select('*')
    .eq('id', id)
    .single()
  return data
}