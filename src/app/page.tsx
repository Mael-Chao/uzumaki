import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

const features = [
  {
    icon: '📝',
    title: 'Rich text editor',
    description: 'Write updates with formatting, code blocks, and more.',
  },
  {
    icon: '🔔',
    title: 'Email notifications',
    description: 'Subscribers get notified automatically on every publish.',
  },
  {
    icon: '🧩',
    title: 'Embeddable widget',
    description: 'One script tag. Show your changelog inside any app.',
  },
  {
    icon: '🌐',
    title: 'Public changelog page',
    description: 'A beautiful page at uzumaki.app/your-product.',
  },
  {
    icon: '🏷️',
    title: 'Tags & versions',
    description: 'Organize updates with feature, fix, and improvement tags.',
  },
  {
    icon: '📊',
    title: 'Analytics',
    description: 'Track entries, subscribers, and engagement over time.',
  },
]

const freePlan = [
  '1 changelog',
  'Unlimited entries',
  'Up to 100 subscribers',
  'Embeddable widget',
]

const freePlanMinus = [
  'Powered by Uzumaki badge',
]

const proPlan = [
  'Multiple changelogs',
  'Unlimited subscribers',
  'Custom domain',
  'No Uzumaki badge',
  'Priority support',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Nav */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-sm">Uzumaki</span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <Link
              href="/login"
              className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">

        {/* Hero */}
        <section className="py-24 text-center">
          <div className="inline-block text-xs font-medium text-muted-foreground border rounded-full px-3 py-1 mb-6">
            Changelog for teams that ship
          </div>
          <h1 className="text-5xl font-semibold tracking-tight leading-tight mb-5">
            Keep your users in the loop.<br />Always.
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
            Publish updates, notify subscribers, and embed your changelog anywhere — in minutes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity"
            >
              Start for free
            </Link>
            <a
              href="#features"
              className="text-sm text-muted-foreground border px-5 py-2.5 rounded-md hover:text-foreground transition-colors"
            >
              See features →
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 border-t">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-8">
            Everything you need
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-muted rounded-xl p-5">
                <p className="text-xl mb-3">{f.icon}</p>
                <p className="text-sm font-medium mb-1.5">{f.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 border-t">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-8">
            Pricing
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">

            {/* Free */}
            <div className="rounded-xl border bg-card p-6 flex flex-col">
              <p className="text-sm font-medium mb-1">Free</p>
              <p className="text-3xl font-semibold mb-6">
                $0<span className="text-sm text-muted-foreground font-normal">/mo</span>
              </p>
              <div className="border-t pt-4 flex flex-col gap-2 flex-1">
                {freePlan.map((item) => (
                  <p key={item} className="text-sm text-muted-foreground">✓ {item}</p>
                ))}
                {freePlanMinus.map((item) => (
                  <p key={item} className="text-sm text-muted-foreground">— {item}</p>
                ))}
              </div>
              <Link
                href="/login"
                className="mt-6 text-sm font-medium text-center border rounded-md py-2 hover:bg-muted transition-colors"
              >
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-xl border-2 border-foreground bg-card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Pro</p>
                <span className="text-xs font-medium bg-foreground text-background px-2 py-0.5 rounded-full">
                  Most popular
                </span>
              </div>
              <p className="text-3xl font-semibold mb-6">
                $12<span className="text-sm text-muted-foreground font-normal">/mo</span>
              </p>
              <div className="border-t pt-4 flex flex-col gap-2 flex-1">
                {proPlan.map((item) => (
                  <p key={item} className="text-sm text-muted-foreground">✓ {item}</p>
                ))}
              </div>
              <Link
                href="/login"
                className="mt-6 text-sm font-medium text-center bg-foreground text-background rounded-md py-2 hover:opacity-90 transition-opacity"
              >
                Get started
              </Link>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Start shipping with clarity
          </h2>
          <p className="text-muted-foreground mb-7">Free forever. No credit card required.</p>
          <Link
            href="/login"
            className="text-sm font-medium bg-foreground text-background px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity"
          >
            Create your changelog →
          </Link>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-medium">Uzumaki</span>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="https://github.com" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
          </div>
          <span className="text-xs text-muted-foreground">© 2026 Uzumaki. All rights reserved.</span>
        </div>
      </footer>

    </div>
  )
}