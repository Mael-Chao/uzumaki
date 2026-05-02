'use client'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

type Action = (formData: FormData) => Promise<{ error: string } | void>
type VoidAction = (formData: FormData) => Promise<void>

type Entry = {
  id: string
  title: string
  content: string
  version: string | null
  tag: string | null
  published: boolean
}

export function EntryForm({
  action,
  entry,
  deleteAction,
}: {
  action: Action
  entry?: Entry
  deleteAction?: VoidAction
}){
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<'draft' | 'publish' | null>(null)

  
  const lowlight = createLowlight()
  lowlight.register('javascript', javascript)
  lowlight.register('typescript', typescript)
  lowlight.register('python', python)
  lowlight.register('bash', bash)
  lowlight.register('css', css)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }), // desactivamos el codeBlock básico
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder: 'What changed?' }),
    ],
    content: entry?.content
      ? entry.content
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
      : '',
    editorProps: {
      attributes: {
        class: 'min-h-[220px] outline-none prose prose-sm max-w-none',
      },
    },
  })

  async function handleSubmit(published: boolean) {
    setLoading(published ? 'publish' : 'draft')
    setError(null)

    const html = editor?.getHTML() ?? ''
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const cleanHtml = doc.body.innerHTML

    const formData = new FormData()
    if (entry) formData.set('id', entry.id)
    formData.set('title', (document.getElementById('title') as HTMLInputElement).value)
    formData.set('content', cleanHtml)
    formData.set('version', (document.getElementById('version') as HTMLInputElement).value)
    formData.set('tag', (document.getElementById('tag') as HTMLSelectElement).value)
    formData.set('published', String(published))

    const result = await action(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {entry ? 'Edit entry' : 'New entry'}
        </h1>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">← Back</Link>
        </Button>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            placeholder="What's new?"
            defaultValue={entry?.title ?? ''}
          />
        </div>

        {/* Tag + Version */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="tag">Tag</Label>
            <select
              id="tag"
              defaultValue={entry?.tag ?? ''}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">No tag</option>
              <option value="feature">Feature</option>
              <option value="fix">Fix</option>
              <option value="improvement">Improvement</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              placeholder="v1.0.0"
              defaultValue={entry?.version ?? ''}
            />
          </div>
        </div>

        {/* Editor */}
        <div className="space-y-1.5">
          <Label>Content</Label>
          <div className="rounded-md border border-input bg-background px-3 py-2">
            <div className="flex items-center gap-1 mb-2 pb-2 border-b">
              {[
                { label: 'B', action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
                { label: 'I', action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
                { label: 'S', action: () => editor?.chain().focus().toggleStrike().run(), active: editor?.isActive('strike') },
                { label: 'H2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
                { label: 'UL', action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
                { label: 'OL', action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList') },
                { label: 'Code', action: () => editor?.chain().focus().toggleCodeBlock().run(), active: editor?.isActive('codeBlock') },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={btn.action}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    btn.active
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!!loading}
              onClick={() => handleSubmit(false)}
            >
              {loading === 'draft' ? 'Saving...' : 'Save draft'}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!!loading}
              onClick={() => handleSubmit(true)}
            >
              {loading === 'publish' ? 'Publishing...' : entry?.published ? 'Update' : 'Publish'}
            </Button>
          </div>

          {deleteAction && (
            <form action={deleteAction}>
              <input type="hidden" name="id" value={entry?.id} />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                Delete
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}