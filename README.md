# Uzumaki

**Changelog for teams that ship.**  
**Changelog para equipos que construyen.**

Uzumaki is an open-source SaaS platform to publish product updates, notify subscribers by email, and embed your changelog anywhere with a single script tag.

Uzumaki es una plataforma SaaS de código abierto para publicar actualizaciones de producto, notificar suscriptores por email, e integrar tu changelog en cualquier app con un solo script.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square)

---

## Features / Características

- **Rich text editor** with syntax highlighting (Tiptap + Lowlight)
- **Public changelog page** at `uzumaki.app/your-slug`
- **Email notifications** via Resend on every publish
- **Embeddable widget** — one script tag, zero dependencies
- **Subscriber management** with unsubscribe support
- **Dark mode** with system preference detection
- **Stats dashboard** — entries, subscribers, tags
- **XSS protection** via DOMPurify

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database & Auth | Supabase |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Rich Text | Tiptap + Lowlight |
| Email | Resend |
| Deployment | Vercel |
| Language | TypeScript |

---

## Getting Started / Primeros pasos

### Prerequisites / Requisitos

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account

### Installation / Instalación

```bash
git clone https://github.com/your-username/uzumaki.git
cd uzumaki
npm install
```

### Environment variables / Variables de entorno

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database setup / Configuración de base de datos

Run the following SQL in your Supabase SQL Editor:

```sql
-- Teams
create table teams (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references auth.users not null,
  name        text not null,
  slug        text not null unique,
  logo_url    text,
  created_at  timestamptz default now()
);

-- Entries
create table entries (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid references teams not null,
  title        text not null,
  content      text not null default '',
  version      text,
  tag          text check (tag in ('feature','fix','improvement')),
  published    boolean default false,
  published_at timestamptz,
  created_at   timestamptz default now()
);

-- Subscribers
create table subscribers (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid references teams not null,
  email       text not null,
  created_at  timestamptz default now(),
  unique(team_id, email)
);

-- RLS
alter table teams enable row level security;
alter table entries enable row level security;
alter table subscribers enable row level security;

create policy "owner access" on teams for all using (auth.uid() = owner_id);
create policy "owner write" on entries for all using (auth.uid() = (select owner_id from teams where id = team_id));
create policy "public read" on entries for select using (published = true);
create policy "owner read" on subscribers for select using (auth.uid() = (select owner_id from teams where id = team_id));
create policy "public insert" on subscribers for insert with check (true);
create policy "public delete" on subscribers for delete using (true);
```

### Run locally / Ejecutar en local

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Embeddable Widget

Add the widget to any app with a single script tag:

```html
<script src="https://uzumaki.app/widget.js" data-slug="your-slug"></script>
<button onclick="Uzumaki.open()">What's new?</button>
```

### Widget API

```js
Uzumaki.open()    // Open the modal
Uzumaki.close()   // Close the modal
Uzumaki.toggle()  // Toggle open/close
```

### Local development

For local testing, add `data-base-url`:

```html
<script src="/widget.js" data-slug="your-slug" data-base-url="http://localhost:3000"></script>
```

---

## Project Structure

```
src/
  app/
    (public)/
      [slug]/           ← Public changelog page
        [id]/           ← Entry detail page
        unsubscribe/    ← Unsubscribe page
    dashboard/          ← Owner dashboard
      _components/      ← Shared components (EntryForm)
      subscribers/      ← Subscribers list
      stats/            ← Stats overview
    settings/           ← Team settings
    api/
      widget/[slug]/    ← Widget JSON API
    login/              ← Auth
  lib/
    supabase/           ← Client & server Supabase instances
    notify-subscribers  ← Email notification helper
  components/
    theme-provider      ← Dark mode provider
    theme-toggle        ← Dark mode toggle
public/
  widget.js             ← Embeddable widget script
```

---

## Contributing / Contribuir

Contributions are welcome. / Las contribuciones son bienvenidas.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow the existing code style and keep components small and focused.

### Ideas for contributions / Ideas para contribuir

- Pagination on public changelog page
- Custom domain support
- Multiple changelogs per account
- RSS feed
- Slack / Discord notifications
- Analytics improvements

---

## License

MIT © [Ismael Pérez Chao](https://github.com/your-username)
