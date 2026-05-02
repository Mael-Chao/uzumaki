'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

type Action = (formData: FormData) => Promise<{ error: string } | void>

type Team = {
  id: string
  name: string
  slug: string
}

export function SettingsForm({ team, updateTeam }: { team: Team; updateTeam: Action }) {
  const [slug, setSlug] = useState(team.slug)
  const [name, setName] = useState(team.name)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSaved(false)
    const result = await updateTeam(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSaved(true)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your team and public changelog URL</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team details</CardTitle>
          <CardDescription>This information is shown on your public changelog page</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Team name</Label>
              <Input
                id="name"
                name="name"
                required
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
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Changing your slug will break any existing links to your changelog
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {saved && <p className="text-sm text-emerald-600">Changes saved</p>}

            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
            <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">← Back</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}