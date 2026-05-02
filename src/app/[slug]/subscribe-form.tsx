'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { subscribe } from './subscribe-action'

export function SubscribeForm({
  teamId,
  teamName,
  slug,
}: {
  teamId: string
  teamName: string
  slug: string
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    setMessage(null)
    const result = await subscribe(formData)
    if (result.error) {
      setStatus('error')
      setMessage(result.error === 'Already subscribed'
        ? 'You are already subscribed.'
        : 'Something went wrong. Try again.')
    } else {
      setStatus('success')
      setMessage('Check your inbox to confirm.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <p className="text-sm font-medium text-emerald-600">✓ Subscribed</p>
        <p className="text-xs text-muted-foreground mt-1">{message}</p>
      </div>
    )
  }

  return (
    <div className="text-center space-y-3">
      <p className="text-sm text-muted-foreground">
        Get notified when new updates are published
      </p>
      <form action={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
        <input type="hidden" name="team_id" value={teamId} />
        <input type="hidden" name="team_name" value={teamName} />
        <input type="hidden" name="slug" value={slug} />
        <Input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          disabled={status === 'loading'}
        />
        <Button type="submit" size="sm" disabled={status === 'loading'}>
          {status === 'loading' ? '...' : 'Notify me'}
        </Button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-destructive">{message}</p>
      )}
    </div>
  )
}