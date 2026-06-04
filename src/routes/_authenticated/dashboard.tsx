import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { mockAuth, mockItems, mockProfile } from "@/lib/mock";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Bell, Plus, Sparkles, TrendingUp, Wallet, ArrowUpRight, Wand2 } from "lucide-react";
import { ItemFormDialog, type ItemRow } from "@/components/app/ItemFormDialog";
import { KpiSkeletonGrid, ListSkeleton } from "@/components/app/Skeleton";
import { RouteError } from "@/components/app/RouteError";
import { toast } from "sonner";
import { CYCLE_LABEL, TYPE_META, daysUntil, formatMoney, monthlyEquivalent } from "@/lib/items";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — LifeRegistry" },
      {
        name: "description",
        content:
          "Your live registry: total items, monthly spend, upcoming renewals, and active alerts.",
      },
    ],
  }),
  component: Dashboard,
  errorComponent: RouteError,
});

function Dashboard() {
  const [name, setName] = useState<string>("");
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const u = mockAuth.getUser();
    const prof = mockProfile.get();
    setName(prof.display_name || u?.email?.split("@")[0] || "friend");
  }, []);

  function load() {
    setLoading(true);
    setItems(mockItems.list());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function loadSamples() {
    setSeeding(true);
    try {
      mockItems.reset();
      toast.success("Sample registry loaded");
      load();
    } finally {
      setSeeding(false);
    }
  }

  const stats = useMemo(() => {
    const active = items.filter((i) => i.status === "active");
    const monthly = active.reduce(
      (sum, i) => sum + monthlyEquivalent(i.cost ?? 0, (i.billing_cycle ?? "monthly") as any),
      0,
    );
    const dueSoon = items.filter((i) => {
      const d = daysUntil(i.renewal_date);
      return d !== null && d >= 0 && d <= 14;
    }).length;
    const alerts = items.filter((i) => {
      const d = daysUntil(i.renewal_date ?? i.expiry_date);
      return (d !== null && d < 0) || i.status === "expired";
    }).length;
    return { total: items.length, monthly, dueSoon, alerts };
  }, [items]);

  const upcoming = useMemo(() => {
    return [...items]
      .filter((i) => i.renewal_date)
      .map((i) => ({ i, d: daysUntil(i.renewal_date)! }))
      .filter((x) => x.d >= -7)
      .sort((a, b) => a.d - b.d)
      .slice(0, 5);
  }, [items]);

  return (
    <AppShell>
      <section className="relative overflow-hidden">
        <div className="bg-radial-hero pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brand-violet">
                / your command center
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                hey {name || "…"} <span className="inline-block tilt-sm-r">👋</span>
              </h1>
              <p className="mt-2 max-w-xl text-muted-foreground">
                {stats.total === 0
                  ? "Drop in your first item and your registry comes alive."
                  : `Tracking ${stats.total} ${stats.total === 1 ? "item" : "items"} · ${formatMoney(stats.monthly)}/mo equivalent.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.total === 0 && !loading && (
                <Button
                  onClick={loadSamples}
                  disabled={seeding}
                  variant="outline"
                  className="rounded-full"
                >
                  <Wand2 className="h-4 w-4" /> {seeding ? "Loading…" : "Try sample data"}
                </Button>
              )}
              <Button
                onClick={() => setAddOpen(true)}
                className="rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90"
              >
                <Plus className="h-4 w-4" /> Add item
              </Button>
            </div>
          </div>

          {/* KPI tiles */}
          {loading ? (
            <KpiSkeletonGrid />
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi
                label="Total items"
                val={String(stats.total)}
                icon={Sparkles}
                tint="bg-brand-violet/15 text-brand-violet"
              />
              <Kpi
                label="Monthly spend"
                val={formatMoney(stats.monthly)}
                icon={Wallet}
                tint="bg-brand-mint/15 text-brand-mint"
              />
              <Kpi
                label="Due in 14d"
                val={String(stats.dueSoon)}
                icon={Bell}
                tint="bg-brand-amber/20 text-amber-700 dark:text-brand-amber"
              />
              <Kpi
                label="Alerts"
                val={String(stats.alerts)}
                icon={TrendingUp}
                tint="bg-brand-coral/15 text-brand-coral"
              />
            </div>
          )}

          {/* Upcoming + side panel */}
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="glass-card rounded-3xl p-6 sm:p-8 lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  / upcoming renewals
                </p>
                <Link
                  to="/items"
                  className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-brand-violet hover:underline"
                >
                  view all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              {loading ? (
                <ListSkeleton rows={4} />
              ) : upcoming.length === 0 ? (
                <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-dashed border-border p-8 text-center sm:items-center">
                  <span className="sticker tilt-sm-l rounded-full bg-brand-amber px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-amber-900">
                    ✦ all clear
                  </span>
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    {stats.total === 0 ? "Add your first item" : "Nothing renewing soon"}
                  </h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    {stats.total === 0
                      ? "Subscriptions, warranties, domains — track anything you pay for or own."
                      : "Your wallet is breathing easy."}
                  </p>
                  {stats.total === 0 && (
                    <div className="mt-1 flex flex-wrap justify-center gap-2">
                      <Button
                        onClick={() => setAddOpen(true)}
                        className="rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90"
                      >
                        <Plus className="h-4 w-4" /> Add item
                      </Button>
                      <Button
                        onClick={loadSamples}
                        disabled={seeding}
                        variant="outline"
                        className="rounded-full"
                      >
                        <Wand2 className="h-4 w-4" /> Try sample data
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <ul className="mt-5 divide-y divide-border">
                  {upcoming.map(({ i, d }) => {
                    const meta = TYPE_META[i.type];
                    const tone =
                      d < 0
                        ? "bg-brand-coral/15 text-brand-coral"
                        : d <= 7
                          ? "bg-brand-amber/25 text-amber-700 dark:text-brand-amber"
                          : "bg-brand-mint/15 text-brand-mint";
                    const label =
                      d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? "today" : `in ${d}d`;
                    return (
                      <li key={i.id} className="flex items-center gap-3 py-3">
                        <span
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl font-display text-lg ${meta.tone}`}
                        >
                          {meta.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-base font-bold tracking-tight">
                            {i.name}
                          </p>
                          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                            {meta.label}
                            {i.vendor ? ` · ${i.vendor}` : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-base font-bold tracking-tight">
                            {formatMoney(i.cost ?? 0, i.currency ?? "USD")}
                            <span className="ml-1 text-xs font-medium text-muted-foreground">
                              {i.billing_cycle ? CYCLE_LABEL[i.billing_cycle] : ""}
                            </span>
                          </p>
                          <span
                            className={`sticker mt-1 inline-block rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${tone}`}
                          >
                            {label}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <aside className="glass-card rounded-3xl p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                / quick jump
              </p>
              <div className="mt-5 grid gap-3">
                <QuickLink
                  to="/items"
                  emoji="◉"
                  label="Registry"
                  hint="Browse & edit"
                  tone="bg-brand-violet/15 text-brand-violet"
                />
                <QuickLink
                  to="/calendar"
                  emoji="◈"
                  label="Calendar"
                  hint="See renewals"
                  tone="bg-brand-mint/15 text-brand-mint"
                />
                <QuickLink
                  to="/settings"
                  emoji="✦"
                  label="Settings"
                  hint="Profile & prefs"
                  tone="bg-brand-amber/25 text-amber-700 dark:text-brand-amber"
                />
              </div>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                checkpoint 4 / 6 — dashboard live
              </p>
            </aside>
          </div>
        </div>
      </section>

      <ItemFormDialog open={addOpen} onOpenChange={setAddOpen} onSaved={load} />
    </AppShell>
  );
}

function Kpi({
  label,
  val,
  icon: Icon,
  tint,
}: {
  label: string;
  val: string;
  icon: typeof Sparkles;
  tint: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <span className={`grid h-8 w-8 place-items-center rounded-full ${tint}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight">{val}</p>
    </div>
  );
}

function QuickLink({
  to,
  emoji,
  label,
  hint,
  tone,
}: {
  to: "/items" | "/calendar" | "/settings";
  emoji: string;
  label: string;
  hint: string;
  tone: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3 transition hover:-translate-y-0.5 hover:border-foreground/30"
    >
      <span
        className={`grid h-10 w-10 place-items-center rounded-2xl font-display text-lg ${tone}`}
      >
        {emoji}
      </span>
      <div className="flex-1">
        <p className="font-display text-base font-bold tracking-tight">{label}</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {hint}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
    </Link>
  );
}
