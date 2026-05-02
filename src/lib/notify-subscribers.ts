import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type Entry = {
  title: string
  content: string
  tag: string | null
  version: string | null
}

type Team = {
  name: string
  slug: string
}

export async function notifySubscribers(
  subscribers: { email: string }[],
  entry: Entry,
  team: Team
) {
  if (!subscribers.length) return

  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  await Promise.all(
    subscribers.map((sub) =>
      resend.emails.send({
        from: 'Uzumaki <onboarding@resend.dev>',
        to: sub.email,
        subject: `${team.name}: ${entry.title}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <p style="font-size: 12px; color: #bbb; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em;">
              ${team.name} — Changelog
            </p>

            ${entry.tag ? `
              <span style="font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 99px; background: ${
                entry.tag === 'feature' ? '#d1fae5' :
                entry.tag === 'fix' ? '#fee2e2' : '#dbeafe'
              }; color: ${
                entry.tag === 'feature' ? '#065f46' :
                entry.tag === 'fix' ? '#991b1b' : '#1e40af'
              };">
                ${entry.tag}
              </span>
            ` : ''}

            <h2 style="font-size: 20px; font-weight: 600; color: #111; margin: 16px 0 8px;">
              ${entry.title}
            </h2>

            ${entry.version ? `
              <p style="font-size: 12px; color: #999; font-family: monospace; margin-bottom: 16px;">
                ${entry.version}
              </p>
            ` : ''}

            <div style="font-size: 14px; color: #666; line-height: 1.7; margin-bottom: 24px;">
              ${entry.content}
            </div>

            <a href="${appUrl}/${team.slug}" 
               style="display: inline-block; background: #111; color: #fff; font-size: 13px; font-weight: 500; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
              View full changelog →
            </a>

            <p style="font-size: 12px; color: #bbb; margin-top: 40px;">
              Powered by Uzumaki · 
              <a href="${appUrl}/${team.slug}/unsubscribe?email=${encodeURIComponent(sub.email)}" style="color: #bbb;">
                Unsubscribe
              </a>
            </p>
          </div>
        `,
      })
    )
  )
}