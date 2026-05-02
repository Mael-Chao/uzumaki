'use client'

import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'

export function EntryContent({ html, full = false }: { html: string; full?: boolean }) {
  const [clean, setClean] = useState('')

  useEffect(() => {
    setClean(DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'p', 'br',
        'strong', 'em', 's', 'u',
        'ul', 'ol', 'li',
        'pre', 'code',
        'blockquote',
      ],
      ALLOWED_ATTR: ['class'],
    }))
  }, [html])
  return (
    <>
      <style>{`
        .entry-content h1 { font-size: 1.25rem; font-weight: 700; margin-top: 0.75rem; margin-bottom: 0.25rem; }
        .entry-content h2 { font-size: 1.1rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.25rem; }
        .entry-content h3 { font-size: 1rem; font-weight: 600; margin-top: 0.5rem; }
        .entry-content p { margin-top: 0.375rem; }
        .entry-content strong { font-weight: 600; }
        .entry-content em { font-style: italic; }
        .entry-content ul { list-style: disc !important; padding-left: 1.25rem !important; margin-top: 0.375rem; }
        .entry-content ol { list-style: decimal !important; padding-left: 1.25rem !important; margin-top: 0.375rem; }
        .entry-content li { margin-top: 0.125rem; }
        .entry-content pre {
          background: oklch(0.18 0 0);
          color: oklch(0.9 0 0);
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 0.5rem 0;
          overflow-x: auto;
        }
        .entry-content pre code {
          font-size: 0.8rem;
          line-height: 1.7;
          background: none;
          padding: 0;
          font-family: monospace;
        }
        .entry-content .hljs-keyword { color: oklch(0.75 0.18 300); }
        .entry-content .hljs-string { color: oklch(0.75 0.15 150); }
        .entry-content .hljs-comment { color: oklch(0.55 0 0); font-style: italic; }
        .entry-content .hljs-number { color: oklch(0.75 0.15 60); }
        .entry-content .hljs-function { color: oklch(0.75 0.15 220); }
        .entry-content .hljs-variable { color: oklch(0.85 0 0); }
        .entry-content .hljs-title { color: oklch(0.75 0.15 220); }
        .entry-content .hljs-built_in { color: oklch(0.75 0.12 200); }
      `}</style>
      <div
        className={`entry-content ${full ? '' : 'line-clamp-4'}`}
        style={{
          fontSize: '0.875rem',
          lineHeight: '1.625',
          color: 'var(--muted-foreground)',
        }}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </>
  )
}