'use server'

import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function subscribe(formData: FormData) {
  const email = formData.get('email') as string
  const teamId = formData.get('team_id') as string
  const teamName = formData.get('team_name') as string
  const slug = formData.get('slug') as string

  if (!email || !teamId) return { error: 'Missing fields' }

  const supabase = await createClient()

  const { error } = await supabase
    .from('subscribers')
    .insert({ team_id: teamId, email })

  if (error) {
    if (error.code === '23505') return { error: 'Already subscribed' }
    return { error: error.message }
  }

  await resend.emails.send({
    from: 'Uzumaki <onboarding@resend.dev>',
    to: email,
    subject: `You're subscribed to ${teamName}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="font-size: 18px; font-weight: 600; color: #111;">You're in ✓</h2>
        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          You'll receive an email whenever <strong>${teamName}</strong> publishes a new update.
        </p>
        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          You can always view the full changelog at:<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/${slug}" style="color: #111;">
            ${process.env.NEXT_PUBLIC_APP_URL}/${slug}
          </a>
        </p>
        <p style="font-size: 12px; color: #bbb; margin-top: 32px;">
          Powered by Uzumaki
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/${slug}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #bbb;">
          Unsubscribe
        </a>
      </div>
    `,
  })

  return { success: true }
}