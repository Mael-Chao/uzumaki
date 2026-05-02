(function () {
  const script = document.currentScript
  const slug = script?.getAttribute('data-slug')
  if (!slug) return console.error('[Uzumaki] Missing data-slug attribute')

  const BASE_URL = script?.getAttribute('data-base-url') || 'https://uzumaki.app'

  let isOpen = false
  let loaded = false
  let entries = []
  let teamName = ''

  // ── Styles ────────────────────────────────────────────────────────────────
  const style = document.createElement('style')
  style.textContent = `
    #uzumaki-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 9998;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.2s ease;
      pointer-events: none;
    }
    #uzumaki-overlay.open {
      opacity: 1;
      pointer-events: all;
    }
    #uzumaki-modal {
      background: #fff;
      border-radius: 12px;
      width: 100%;
      max-width: 520px;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transform: translateY(8px);
      transition: transform 0.2s ease;
      margin: 16px;
    }
    #uzumaki-overlay.open #uzumaki-modal {
      transform: translateY(0);
    }
    #uzumaki-header {
      padding: 20px 24px 16px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    #uzumaki-header h2 {
      font-size: 15px;
      font-weight: 600;
      color: #111;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #uzumaki-close {
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      font-size: 20px;
      line-height: 1;
      padding: 0;
    }
    #uzumaki-close:hover { color: #111; }
    #uzumaki-list {
      overflow-y: auto;
      padding: 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .uzumaki-entry { border-bottom: 1px solid #f0f0f0; padding-bottom: 20px; }
    .uzumaki-entry:last-child { border-bottom: none; padding-bottom: 0; }
    .uzumaki-meta {
      display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
    }
    .uzumaki-tag {
      font-size: 11px; font-weight: 500;
      padding: 2px 8px; border-radius: 99px;
    }
    .uzumaki-tag.feature { background: #d1fae5; color: #065f46; }
    .uzumaki-tag.fix { background: #fee2e2; color: #991b1b; }
    .uzumaki-tag.improvement { background: #dbeafe; color: #1e40af; }
    .uzumaki-version { font-size: 11px; color: #999; font-family: monospace; }
    .uzumaki-date { font-size: 11px; color: #bbb; margin-left: auto; }
    .uzumaki-title {
      font-size: 14px; font-weight: 600; color: #111; margin: 0 0 6px;
    }
    .uzumaki-content {
      font-size: 13px; color: #666; line-height: 1.6;
    }
    .uzumaki-content p { margin: 4px 0; }
    .uzumaki-content ul { list-style: disc; padding-left: 16px; margin: 4px 0; }
    .uzumaki-content ol { list-style: decimal; padding-left: 16px; margin: 4px 0; }
    .uzumaki-content strong { font-weight: 600; }
    .uzumaki-content em { font-style: italic; }
    #uzumaki-footer {
      padding: 12px 24px;
      border-top: 1px solid #f0f0f0;
      text-align: center;
    }
    #uzumaki-footer a {
      font-size: 11px; color: #bbb; text-decoration: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #uzumaki-footer a:hover { color: #666; }
  `
  document.head.appendChild(style)

  // ── DOM ───────────────────────────────────────────────────────────────────
  const overlay = document.createElement('div')
  overlay.id = 'uzumaki-overlay'
  overlay.innerHTML = `
    <div id="uzumaki-modal">
      <div id="uzumaki-header">
        <h2>What's new</h2>
        <button id="uzumaki-close">×</button>
      </div>
      <div id="uzumaki-list">
        <p style="color:#bbb;font-size:13px;font-family:sans-serif">Loading...</p>
      </div>
      <div id="uzumaki-footer">
        <a href="https://uzumaki.app" target="_blank">Powered by Uzumaki</a>
      </div>
    </div>
  `
  document.body.appendChild(overlay)

  // ── Close handlers ────────────────────────────────────────────────────────
  document.getElementById('uzumaki-close').addEventListener('click', () => window.Uzumaki.close())
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) window.Uzumaki.close()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.Uzumaki.close()
  })

  // ── Data ──────────────────────────────────────────────────────────────────
  function formatDate(str) {
    return new Date(str).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  function render() {
    const list = document.getElementById('uzumaki-list')
    if (!entries.length) {
      list.innerHTML = '<p style="color:#bbb;font-size:13px;font-family:sans-serif">No updates yet.</p>'
      return
    }
    list.innerHTML = entries.map(e => `
      <div class="uzumaki-entry">
        <div class="uzumaki-meta">
          ${e.tag ? `<span class="uzumaki-tag ${e.tag}">${e.tag}</span>` : ''}
          ${e.version ? `<span class="uzumaki-version">${e.version}</span>` : ''}
          <span class="uzumaki-date">${formatDate(e.published_at)}</span>
        </div>
        <p class="uzumaki-title">${e.title}</p>
        <div class="uzumaki-content">${e.content}</div>
      </div>
    `).join('')
  }

  async function load() {
    if (loaded) return
    try {
      const res = await fetch(`${BASE_URL}/api/widget/${slug}`)
      const data = await res.json()
      entries = data.entries || []
      teamName = data.team?.name || ''
      const header = document.querySelector('#uzumaki-header h2')
      if (header) header.textContent = teamName ? `${teamName} — What's new` : "What's new"
      render()
      loaded = true
    } catch (e) {
      document.getElementById('uzumaki-list').innerHTML =
        '<p style="color:#bbb;font-size:13px;font-family:sans-serif">Failed to load updates.</p>'
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.Uzumaki = {
    open() {
      overlay.classList.add('open')
      isOpen = true
      load()
    },
    close() {
      overlay.classList.remove('open')
      isOpen = false
    },
    toggle() {
      isOpen ? this.close() : this.open()
    }
  }
})()