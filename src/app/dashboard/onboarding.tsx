'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type Action = (formData: FormData) => Promise<{ error: string } | void>

export function Onboarding({ createTeam }: { createTeam: Action }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setName(value)
    setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createTeam(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Uzumaki</h1>
          <p className="text-sm text-muted-foreground mt-1">Let's set up your changelog</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Create your team</CardTitle>
            <CardDescription>This is how your changelog will be identified publicly</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Team name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Acme Inc."
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">Public URL</Label>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">uzumaki.app/</span>
                  <Input
                    id="slug"
                    name="slug"
                    required
                    placeholder="acme-inc"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading || !slug || !name}>
                {loading ? 'Creating...' : 'Create changelog'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}