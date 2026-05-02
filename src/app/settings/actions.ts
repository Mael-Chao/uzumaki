'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function updateTeam(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: 'Slug only allows lowercase letters, numbers and hyphens' }
  }

  const { error } = await supabase
    .from('teams')
    .update({ name, slug })
    .eq('owner_id', user.id)

  if (error) {
    if (error.code === '23505') return { error: 'That slug is already taken' }
    return { error: error.message }
  }

  redirect('/settings')
}

export async function getTeamForSettings() {
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