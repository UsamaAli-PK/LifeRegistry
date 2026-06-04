import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { mockItems } from "@/lib/mock";
import { AppShell } from "@/components/app/AppShell";
import { type ItemRow } from "@/components/app/ItemFormDialog";
import { CYCLE_LABEL, TYPE_META, formatMoney, monthlyEquivalent, type ItemType } from "@/lib/items";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Flame, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { RouteError } from "@/components/app/RouteError";
import { KpiSkeletonGrid } from "@/components/app/Skeleton";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — LifeRegistry" },
      {
        name: "description",
        content:
          "See where your money goes — monthly burn, spend share by category, and your heaviest items.",
      },
    ],
  }),
  component: AnalyticsPage,
  errorComponent: RouteError,
});

const TYPE_COLORS: Record<ItemType, string> = {
  subscription: "hsl(265 85% 65%)",
  warranty: "hsl(160 70% 50%)",
  account: "hsl(210 85% 60%)",
  domain: "hsl(10 85% 65%)",
  membership: "hsl(40 95% 55%)",
  insurance: "hsl(150 60% 45%)",
  bill: "hsl(0 80% 60%)",
  device: "hsl(280 70% 60%)",
  other: "hsl(220 10% 55%)",
};

function AnalyticsPage() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setItems(mockItems.list());
    setLoading(false);
  }, []);

  const active = useMemo(() => items.filter((i) => i.status === "active"), [items]);

  const overview = useMemo(() => {
    const monthly = active.reduce(
      (s, i) => s + monthlyEquivalent(i.cost ?? 0, (i.billing_cycle ?? "monthly") as any),
      0,
    );
    const lifetime = items.reduce((s, i) => s + (i.cost ?? 0), 0);
    const topItem = [...active].sort(
      (a, b) =>
        monthlyEquivalent(b.cost ?? 0, (b.billing_cycle ?? "monthly") as any) -
        monthlyEquivalent(a.cost ?? 0, (a.billing_cycle ?? "monthly") as any),
    )[0];
    const byType: Record<string, number> = {};
    for (const i of active) {
      byType[i.type] =
        (byType[i.type] ?? 0) +
        monthlyEquivalent(i.cost ?? 0, (i.billing_cycle ?? "monthly") as any);
    }
    const topCategory = Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] as
      | ItemType
      | undefined;
    return { monthly, lifetime, topItem, topCategory, yearly: monthly * 12 };
  }, [items, active]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const i of active) {
      const m = monthlyEquivalent(i.cost ?? 0, (i.billing_cycle ?? "monthly") as any);
      if (m === 0) continue;
      map[i.type] = (map[i.type] ?? 0) + m;
    }
    return Object.entries(map)
      .map(([type, value]) => ({
        type: type as ItemType,
        value: Number(value.toFixed(2)),
        label: TYPE_META[type as ItemType].label,
      }))
      .sort((a, b) => b.value - a.value);
  }, [active]);

  const timeline = useMemo(() => {
    // Last 12 months — for each month, sum monthlyEquivalent of items whose
    // created_at <= end-of-month AND (no renewal_date OR renewal_date >= start-of-month)
    const out: { month: string; spend: number }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const label = d.toLocaleString("en-US", { month: "short" });
      let spend = 0;
      for (const it of items) {
        if (it.status !== "active") continue;
        const createdRaw = (it as unknown as { created_at?: string }).created_at;
        const created = createdRaw ? new Date(createdRaw) : d;
        if (created > end) continue;
        spend += monthlyEquivalent(it.cost ?? 0, (it.billing_cycle ?? "monthly") as any);
      }
      out.push({ month: label, spend: Number(spend.toFixed(2)) });
    }
    return out;
  }, [items]);

  const topItems = useMemo(() => {
    return [...active]
      .map((i) => ({
        i,
        monthly: monthlyEquivalent(i.cost ?? 0, (i.billing_cycle ?? "monthly") as any),
      }))
      .filter((x) => x.monthly > 0)
      .sort((a, b) => b.monthly - a.monthly)
      .slice(0, 8);
  }, [active]);

  if (loading) {
    return (
      <AppShell>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-violet">
            / where the money goes
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Analytics
          </h1>
          <KpiSkeletonGrid />
        </section>
      </AppShell>
    );
  }

  if (items.length === 0) {
    return (
      <AppShell>
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="glass-card flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border p-12 text-center">
            <span className="sticker tilt-sm-l rounded-full bg-brand-violet px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white">
              ✦ no data yet
            </span>
            <h3 className="font-display text-3xl font-bold tracking-tight">
              Add items to unlock insights
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Once you've tracked a few subscriptions and bills, this page lights up with where your
              money actually goes.
            </p>
            <Link
              to="/items"
              className="rounded-full bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background hover:bg-foreground/90"
            >
              go to registry
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="relative overflow-hidden">
        <div className="bg-radial-hero pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-violet">
            / where the money goes
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live snapshot across {active.length} active {active.length === 1 ? "item" : "items"}.
          </p>

          {/* Overview */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Monthly burn"
              val={formatMoney(overview.monthly)}
              icon={Wallet}
              tint="bg-brand-violet/15 text-brand-violet"
            />
            <Stat
              label="Yearly burn"
              val={formatMoney(overview.yearly)}
              icon={TrendingUp}
              tint="bg-brand-mint/15 text-brand-mint"
            />
            <Stat
              label="Top category"
              val={overview.topCategory ? TYPE_META[overview.topCategory].label : "—"}
              icon={Sparkles}
              tint="bg-brand-amber/25 text-amber-700 dark:text-brand-amber"
            />
            <Stat
              label="Biggest item"
              val={overview.topItem?.name ?? "—"}
              icon={Flame}
              tint="bg-brand-coral/15 text-brand-coral"
            />
          </div>

          {/* Charts */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Pie */}
            <div className="glass-card rounded-3xl p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                / by category
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">Spend share</h3>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {categoryData.map((c) => (
                        <Cell key={c.type} fill={TYPE_COLORS[c.type]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--background))",
                      }}
                      formatter={(v: number) => formatMoney(v)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1.5">
                {categoryData.slice(0, 5).map((c) => (
                  <li key={c.type} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: TYPE_COLORS[c.type] }}
                      />
                      <span className="font-mono uppercase tracking-widest text-muted-foreground">
                        {c.label}
                      </span>
                    </span>
                    <span className="font-display font-bold">{formatMoney(c.value)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 lg:col-span-2">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                / last 12 months
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">
                Monthly burn timeline
              </h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeline} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--background))",
                      }}
                      formatter={(v: number) => formatMoney(v)}
                    />
                    <Bar dataKey="spend" fill="hsl(265 85% 65%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top items */}
          <div className="glass-card mt-6 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  / heaviest hitters
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">
                  Top items by monthly cost
                </h3>
              </div>
              <Link
                to="/items"
                className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-brand-violet hover:underline"
              >
                edit <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="mt-5 divide-y divide-border">
              {topItems.map(({ i, monthly }) => {
                const meta = TYPE_META[i.type];
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
                        {formatMoney(monthly)}
                        <span className="ml-1 text-xs font-medium text-muted-foreground">/mo</span>
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {formatMoney(i.cost ?? 0, i.currency ?? "USD")}
                        {i.billing_cycle ? ` ${CYCLE_LABEL[i.billing_cycle]}` : ""}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            lifetime tracked spend · {formatMoney(overview.lifetime)}
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function Stat({
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
      <p className="mt-3 truncate font-display text-2xl font-bold tracking-tight">{val}</p>
    </div>
  );
}
