import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle2,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LifeRegistry — Stay on top of everything" },
      {
        name: "description",
        content:
          "One secure dashboard for every subscription, warranty, account, and renewal. Never forget, never overpay, never lose access.",
      },
      { property: "og:title", content: "LifeRegistry — Stay on top of everything" },
      {
        property: "og:description",
        content:
          "Track every subscription, warranty, account, and renewal in one secure registry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

// ──────────────────────────────────────────────────────────
// Content
// ──────────────────────────────────────────────────────────
const problems = [
  { q: "I forgot I was paying for this", a: "Every subscription, with its renewal date.", tone: "violet" as const },
  { q: "When does my warranty expire?", a: "Countdowns + alerts before it lapses.", tone: "mint" as const },
  { q: "Where did I save my insurance policy?", a: "Attach the PDF to the item itself.", tone: "amber" as const },
  { q: "What accounts do I even have?", a: "A complete inventory, in one view.", tone: "coral" as const },
  { q: "When does my domain renew?", a: "One calendar. Every renewal.", tone: "violet" as const },
  { q: "My partner doesn't know our accounts", a: "Share a household view, role-based.", tone: "mint" as const },
  { q: "Time to audit my subscriptions", a: "Built-in keep / cancel / snooze.", tone: "amber" as const },
  { q: "What if something happens to me?", a: "Designated legacy contact, optional.", tone: "coral" as const },
];

const features = [
  { icon: Layers, title: "Universal registry", desc: "Subscriptions, warranties, domains, memberships, insurance, devices — all in one place.", featured: true },
  { icon: Calendar, title: "Renewal calendar", desc: "Every upcoming charge & expiration, week or month." },
  { icon: Bell, title: "Smart reminders", desc: "Email & in-app alerts at 30 / 7 / 1 days." },
  { icon: FileText, title: "Document vault", desc: "Attach receipts, policies, warranty PDFs." },
  { icon: Wallet, title: "Spend at a glance", desc: "Know exactly what you pay monthly & yearly." },
  { icon: Users, title: "Household sharing", desc: "Invite partner or family. Viewer / editor roles." },
  { icon: ShieldCheck, title: "Legacy access", desc: "Emergency contact, only if you choose." },
  { icon: Sparkles, title: "Audit mode", desc: "Quarterly walk-through. Keep, cancel, snooze." },
];

// ──────────────────────────────────────────────────────────
function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Marquee />
      <Problems />
      <BigStat />
      <Features />
      <HowItWorks />
      <Pricing />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Hero — magazine split, oversized headline + dashboard card
// ──────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-radial-hero" aria-hidden />
      <div className="absolute inset-0 opacity-[0.35] grid-paper" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-28 lg:pt-20">
        {/* Left: headline */}
        <div className="relative lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-mint" /> v0.1 · now in beta
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Stay on top of <em className="not-italic text-brand-gradient">everything</em>
            <br />
            you own and pay for.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            One secure registry for every subscription, warranty, account, and renewal —
            so you never forget, never overpay, and never lose access to anything important.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" className="rounded-full bg-brand-gradient px-6 text-white shadow-lg shadow-brand-violet/25 hover:opacity-95">
              Start your registry <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              See how it works
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-4 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-foreground/60" /> Free to start</span>
            <span className="inline-flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-foreground/60" /> No credit card</span>
            <span className="inline-flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-foreground/60" /> Private by design</span>
          </div>

          {/* Floating stickers */}
          <div className="pointer-events-none absolute -left-6 top-72 hidden lg:block">
            <Sticker tone="amber" className="tilt-l">
              <Star className="h-3 w-3" /> renews soon
            </Sticker>
          </div>
        </div>

        {/* Right: dashboard preview */}
        <div className="relative lg:col-span-5">
          <DashboardPreview />
          {/* stickers around card */}
          <div className="pointer-events-none absolute -right-2 -top-3 hidden sm:block">
            <Sticker tone="mint" className="tilt-r">new</Sticker>
          </div>
          <div className="pointer-events-none absolute -bottom-3 -left-3 hidden sm:block">
            <Sticker tone="violet" className="tilt-l">$5/mo</Sticker>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="glass-card relative rounded-3xl p-2 shadow-2xl shadow-brand-violet/10">
      <div className="rounded-2xl bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <div>
              <p className="text-sm font-semibold">Good evening, Alex</p>
              <p className="text-xs text-muted-foreground">You&apos;re all caught up.</p>
            </div>
          </div>
          <div className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -right-1 -top-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-coral text-[8px] font-bold text-white">3</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <KpiTile icon={Layers} label="Total items" value="47" tint="violet" />
          <KpiTile icon={Wallet} label="Monthly spend" value="$263.88" tint="mint" />
          <KpiTile icon={Calendar} label="Due soon" value="3" tint="amber" />
          <KpiTile icon={Bell} label="Alerts" value="2" tint="coral" />
        </div>

        <div className="mt-5 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">/ upcoming</p>
            <a href="#" className="text-xs font-medium text-brand-violet hover:underline">view all →</a>
          </div>
          <ul className="mt-3 space-y-3">
            <UpcomingRow name="Netflix Premium" sub="Renews in 3 days" amount="$19.99" tag="Due soon" tone="amber" />
            <UpcomingRow name="iCloud+ 200GB" sub="Renews in 9 days" amount="$2.99" tag="Subscription" tone="violet" />
            <UpcomingRow name="MacBook AppleCare" sub="Expires in 21 days" amount="—" tag="Warranty" tone="mint" />
          </ul>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Marquee
// ──────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "subscriptions", "warranties", "domains", "memberships",
    "insurance", "devices", "utilities", "memberships",
    "free trials", "renewals", "appliances", "software licenses",
  ];
  const row = [...items, ...items];
  return (
    <section className="overflow-hidden border-b border-border bg-foreground py-5 text-background">
      <div className="flex w-max marquee-track gap-10 whitespace-nowrap font-display text-2xl font-semibold sm:text-3xl">
        {row.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            <span>{t}</span>
            <span className="text-brand-mint">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// Problems
// ──────────────────────────────────────────────────────────
function Problems() {
  return (
    <section className="border-b border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow>/ problems → solutions</SectionEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          The end of <span className="italic text-brand-gradient">&ldquo;wait, what am I paying for?&rdquo;</span>
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Every scattered note, spreadsheet, and forgotten email — replaced by one clean registry.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, i) => {
            const accent =
              p.tone === "violet" ? "text-brand-violet" :
              p.tone === "mint" ? "text-brand-mint" :
              p.tone === "amber" ? "text-[oklch(0.55_0.15_75)]" :
              "text-brand-coral";
            return (
              <div
                key={p.q}
                className="group relative rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-lg"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  / {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 font-display text-base font-semibold leading-snug">
                  &ldquo;{p.q}&rdquo;
                </p>
                <div className="my-3 h-px w-8 bg-foreground/15" />
                <p className={`flex items-start gap-2 text-sm ${accent}`}>
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="text-foreground">{p.a}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// Big numeric divider
// ──────────────────────────────────────────────────────────
function BigStat() {
  const stats = [
    { v: "47", l: "items tracked / avg user" },
    { v: "$1.8k", l: "saved per year / median" },
    { v: "0", l: "things to remember" },
  ];
  return (
    <section className="border-b border-border bg-brand-gradient text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8 lg:py-20">
        {stats.map((s) => (
          <div key={s.l} className="flex flex-col">
            <p className="font-display text-6xl font-bold tracking-tight sm:text-7xl">{s.v}</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-white/80">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// Features — magazine featured + grid
// ──────────────────────────────────────────────────────────
function Features() {
  const [featured, ...rest] = features;
  return (
    <section id="features" className="border-b border-border bg-muted/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow>/ features</SectionEyebrow>
        <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Everything you need.<br />
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Not a password manager. Not a finance tracker. The missing inventory layer for your digital life.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {/* Featured */}
          <div className="group relative overflow-hidden rounded-3xl border border-border bg-foreground p-7 text-background lg:col-span-2 lg:row-span-2 lg:p-10">
            <span className="font-mono text-[11px] uppercase tracking-widest text-background/60">
              / 01 — flagship
            </span>
            <div className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient">
              <featured.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {featured.title}
            </h3>
            <p className="mt-3 max-w-md text-background/70">{featured.desc}</p>

            <div className="mt-8 grid grid-cols-3 gap-2">
              {["Subscriptions", "Warranties", "Domains", "Memberships", "Insurance", "Devices"].map((c) => (
                <div key={c} className="rounded-xl border border-background/15 bg-background/5 px-3 py-2 text-xs font-medium">
                  {c}
                </div>
              ))}
            </div>

            <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-background/40 transition group-hover:text-background" />
          </div>

          {rest.map((f, i) => (
            <div key={f.title} className="group relative rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  / {String(i + 2).padStart(2, "0")}
                </span>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <f.icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// How it works
// ──────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", t: "Add what you own", d: "Subscriptions, warranties, domains — start with what comes to mind. Import from CSV later.", tone: "violet" },
    { n: "02", t: "Set the dates", d: "Renewal, expiration, billing cycle. We handle the reminders from there.", tone: "mint" },
    { n: "03", t: "Stay in control", d: "Review your dashboard, audit quarterly, share with your household. Done.", tone: "amber" },
  ];
  return (
    <section id="how" className="border-b border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow>/ how it works</SectionEyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          Three steps to clarity.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative rounded-3xl border border-border bg-card p-7">
              <span
                className={`font-mono text-7xl font-bold leading-none ${
                  s.tone === "violet" ? "text-brand-violet" :
                  s.tone === "mint" ? "text-brand-mint" :
                  "text-[oklch(0.55_0.15_75)]"
                }`}
              >
                {s.n}
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute right-5 top-5 hidden h-5 w-5 text-muted-foreground md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// Pricing
// ──────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" className="border-b border-border bg-muted/40 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow>/ pricing</SectionEyebrow>
        <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Simple pricing.<br />
            <span className="text-muted-foreground">Upgrade when you outgrow it.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <PricingCard
            name="Free"
            price="$0"
            tagline="For getting started"
            features={["Up to 25 items", "Renewal reminders", "Document attachments (50MB)", "Single user"]}
          />
          <PricingCard
            name="Pro"
            price="$5"
            tagline="For full coverage"
            featured
            features={[
              "Unlimited items",
              "Household sharing (up to 5)",
              "Document attachments (5GB)",
              "Legacy contact",
              "CSV import / export",
              "Quarterly audit mode",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// FAQ
// ──────────────────────────────────────────────────────────
function Faq() {
  const items = [
    { q: "Is LifeRegistry a password manager?", a: "No. We don't store credentials. Use a password manager for those — LifeRegistry tracks the accounts, subscriptions, warranties, and renewals around them." },
    { q: "Do you connect to my bank?", a: "Never. You enter what you want to track. We don't sync your transactions or access financial accounts." },
    { q: "Is my data private?", a: "Yes. Your registry is yours alone. Documents are stored in a private bucket with access scoped strictly to you and anyone you explicitly share with." },
    { q: "Can I share with my partner?", a: "Yes — household sharing is built in. Invite family members as viewers or co-editors on a Pro plan." },
  ];
  return (
    <section id="faq" className="border-b border-border bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <SectionEyebrow>/ faq</SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Questions, <span className="text-brand-gradient">answered</span>.
          </h2>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Still curious? Ping us — we read every message.
          </p>
        </div>
        <div className="space-y-3 lg:col-span-8">
          {items.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-border bg-card p-5 transition open:border-foreground/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-display text-base font-semibold tracking-tight">{f.q}</span>
                <span className="font-mono text-xl text-muted-foreground transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// Final CTA
// ──────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-foreground p-10 text-background sm:p-14">
          <div className="absolute inset-0 bg-radial-hero opacity-40" aria-hidden />
          <div className="relative">
            <SectionEyebrow className="text-background/60">/ ready?</SectionEyebrow>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Start your registry today.
            </h2>
            <p className="mt-4 max-w-lg text-background/70">
              Five minutes to set up. A lifetime of never asking &ldquo;what am I paying for?&rdquo; again.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" className="rounded-full bg-brand-gradient px-6 text-white shadow-lg hover:opacity-95">
                Get started free <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background">
                Book a 10-min demo
              </Button>
            </div>
            {/* stickers */}
            <div className="pointer-events-none absolute right-2 top-2 hidden sm:block">
              <Sticker tone="amber" className="tilt-r">free forever tier</Sticker>
            </div>
            <div className="pointer-events-none absolute -bottom-1 right-10 hidden md:block">
              <Sticker tone="mint" className="tilt-l">no credit card</Sticker>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// Bits
// ──────────────────────────────────────────────────────────
function SectionEyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground ${className}`}>
      {children}
    </p>
  );
}

function Sticker({
  children,
  tone,
  className = "",
}: {
  children: React.ReactNode;
  tone: "violet" | "mint" | "amber" | "coral";
  className?: string;
}) {
  const tones = {
    violet: "bg-brand-violet text-white",
    mint: "bg-brand-mint text-foreground",
    amber: "bg-brand-amber text-[oklch(0.25_0.05_60)]",
    coral: "bg-brand-coral text-white",
  } as const;
  return (
    <span
      className={`sticker inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

function KpiTile({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof Layers;
  label: string;
  value: string;
  tint: "violet" | "mint" | "amber" | "coral";
}) {
  const tints = {
    violet: "bg-brand-violet/10 text-brand-violet",
    mint: "bg-brand-mint/15 text-brand-mint",
    amber: "bg-brand-amber/20 text-[oklch(0.55_0.15_75)]",
    coral: "bg-brand-coral/10 text-brand-coral",
  } as const;
  return (
    <div className="rounded-xl border border-border bg-background/60 p-3.5">
      <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${tints[tint]}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="mt-2.5 font-display text-2xl font-bold tracking-tight">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function UpcomingRow({
  name,
  sub,
  amount,
  tag,
  tone,
}: {
  name: string;
  sub: string;
  amount: string;
  tag: string;
  tone: "violet" | "mint" | "amber";
}) {
  const toneClass = {
    violet: "bg-brand-violet/10 text-brand-violet",
    mint: "bg-brand-mint/15 text-brand-mint",
    amber: "bg-brand-amber/20 text-[oklch(0.55_0.15_75)]",
  }[tone];
  return (
    <li className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{amount}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${toneClass}`}>{tag}</span>
      </div>
    </li>
  );
}

function PricingCard({
  name,
  price,
  tagline,
  features,
  featured,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={
        "relative rounded-3xl border p-7 sm:p-8 " +
        (featured
          ? "border-transparent bg-foreground text-background shadow-xl"
          : "border-border bg-card")
      }
    >
      {featured && (
        <div className="absolute -top-3 left-7">
          <Sticker tone="amber" className="tilt-sm-r">most popular</Sticker>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold tracking-tight">{name}</h3>
        <span
          className={
            "font-mono text-[11px] uppercase tracking-widest " +
            (featured ? "text-background/60" : "text-muted-foreground")
          }
        >
          {tagline}
        </span>
      </div>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-6xl font-bold tracking-tight">{price}</span>
        <span className={"text-sm " + (featured ? "text-background/70" : "text-muted-foreground")}>
          / month
        </span>
      </div>
      <ul className="mt-7 space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <CheckCircle2
              className={
                "mt-0.5 h-4 w-4 shrink-0 " + (featured ? "text-brand-mint" : "text-brand-mint")
              }
            />
            <span className={featured ? "text-background/95" : "text-foreground"}>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        className={
          "mt-8 w-full rounded-full " +
          (featured
            ? "bg-brand-gradient text-white hover:opacity-95"
            : "bg-foreground text-background hover:bg-foreground/90")
        }
      >
        {featured ? "Start Pro →" : "Start free →"}
      </Button>
    </div>
  );
}
