import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { mockItems } from "@/lib/mock";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ItemFormDialog, type ItemRow } from "@/components/app/ItemFormDialog";
import { CYCLE_LABEL, TYPE_META, formatMoney } from "@/lib/items";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { RouteError } from "@/components/app/RouteError";

export const Route = createFileRoute("/_authenticated/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — LifeRegistry" },
      {
        name: "description",
        content: "Month-view of every upcoming renewal and expiration across your registry.",
      },
    ],
  }),
  component: CalendarPage,
  errorComponent: RouteError,
});

type Mode = "renewal" | "expiry";

function CalendarPage() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [mode, setMode] = useState<Mode>("renewal");
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState<ItemRow | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  function load() {
    setItems(mockItems.list());
  }

  useEffect(() => {
    load();
  }, []);

  // Map YYYY-MM-DD → items for this mode
  const byDate = useMemo(() => {
    const m: Record<string, ItemRow[]> = {};
    for (const i of items) {
      const date = mode === "renewal" ? i.renewal_date : i.expiry_date;
      if (!date) continue;
      (m[date] ??= []).push(i);
    }
    return m;
  }, [items, mode]);

  // Build the visible 6-week grid
  const grid = useMemo(() => {
    const firstWeekday = cursor.getDay(); // 0..6
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: { date: Date; iso: string; inMonth: boolean }[] = [];
    // pad start
    for (let i = firstWeekday; i > 0; i--) {
      const d = new Date(cursor);
      d.setDate(1 - i);
      cells.push({ date: d, iso: toIso(d), inMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(cursor.getFullYear(), cursor.getMonth(), i);
      cells.push({ date: d, iso: toIso(d), inMonth: true });
    }
    // pad end to multiple of 7
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date;
      const d = new Date(last);
      d.setDate(last.getDate() + 1);
      cells.push({ date: d, iso: toIso(d), inMonth: false });
    }
    return cells;
  }, [cursor]);

  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });
  const todayIso = toIso(new Date());
  const selectedItems = selected ? (byDate[selected] ?? []) : [];

  return (
    <AppShell>
      <section className="relative overflow-hidden">
        <div className="bg-radial-hero pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brand-violet">
                / what's coming up
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {monthLabel}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-full border border-border bg-background/60 p-1">
                <ModeBtn active={mode === "renewal"} onClick={() => setMode("renewal")}>
                  Renewals
                </ModeBtn>
                <ModeBtn active={mode === "expiry"} onClick={() => setMode("expiry")}>
                  Expirations
                </ModeBtn>
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-full"
                onClick={() => shift(setCursor, -1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-9 rounded-full font-mono text-[11px] uppercase tracking-widest"
                onClick={() => {
                  const d = new Date();
                  d.setDate(1);
                  setCursor(d);
                }}
              >
                Today
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-full"
                onClick={() => shift(setCursor, 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Weekday header (md+) */}
          <div className="mt-8 hidden grid-cols-7 gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="px-2 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Month grid (md+) */}
          <div className="mt-2 hidden grid-cols-7 gap-2 md:grid">
            {grid.map((c) => {
              const list = byDate[c.iso] ?? [];
              const isToday = c.iso === todayIso;
              return (
                <button
                  key={c.iso + (c.inMonth ? "" : "o")}
                  onClick={() => list.length > 0 && setSelected(c.iso)}
                  className={`glass-card group min-h-[110px] rounded-2xl p-2 text-left transition ${
                    c.inMonth ? "" : "opacity-40"
                  } ${list.length > 0 ? "hover:-translate-y-0.5 cursor-pointer" : "cursor-default"}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-display text-sm font-bold tracking-tight ${
                        isToday ? "rounded-full bg-foreground px-2 py-0.5 text-background" : ""
                      }`}
                    >
                      {c.date.getDate()}
                    </span>
                    {list.length > 0 && (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        {list.length}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {list.slice(0, 3).map((i, idx) => {
                      const meta = TYPE_META[i.type];
                      const tilts = ["tilt-sm-l", "tilt-sm-r", ""];
                      return (
                        <span
                          key={i.id}
                          className={`sticker truncate rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${meta.tone} ${tilts[idx]}`}
                          title={i.name}
                        >
                          {meta.emoji} {i.name.slice(0, 10)}
                        </span>
                      );
                    })}
                    {list.length > 3 && (
                      <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        +{list.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Agenda (mobile) */}
          <div className="mt-8 space-y-3 md:hidden">
            {grid
              .filter((c) => c.inMonth && (byDate[c.iso] ?? []).length > 0)
              .map((c) => (
                <button
                  key={c.iso}
                  onClick={() => setSelected(c.iso)}
                  className="glass-card flex w-full items-center gap-4 rounded-2xl p-4 text-left"
                >
                  <div className="text-center">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {c.date.toLocaleString("en-US", { month: "short" })}
                    </p>
                    <p className="font-display text-2xl font-bold tracking-tight">
                      {c.date.getDate()}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1">
                      {(byDate[c.iso] ?? []).slice(0, 4).map((i, idx) => {
                        const meta = TYPE_META[i.type];
                        const tilts = ["tilt-sm-l", "tilt-sm-r", "", "tilt-sm-l"];
                        return (
                          <span
                            key={i.id}
                            className={`sticker rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${meta.tone} ${tilts[idx]}`}
                          >
                            {meta.emoji} {i.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </button>
              ))}
            {grid.filter((c) => c.inMonth && (byDate[c.iso] ?? []).length > 0).length === 0 && (
              <div className="glass-card flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border p-10 text-center">
                <span className="sticker tilt-sm-l rounded-full bg-brand-mint px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-emerald-900">
                  ✦ clear month
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  No {mode === "renewal" ? "renewals" : "expirations"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add dates to your items to see them here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl tracking-tight">
              {selected &&
                new Date(selected + "T00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            {selectedItems.map((i) => {
              const meta = TYPE_META[i.type];
              return (
                <div key={i.id} className="glass-card rounded-2xl p-4">
                  <div className="flex items-start gap-3">
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
                      <p className="mt-2 font-display text-lg font-bold tracking-tight">
                        {formatMoney(i.cost ?? 0, i.currency ?? "USD")}
                        <span className="ml-1 text-xs font-medium text-muted-foreground">
                          {i.billing_cycle ? CYCLE_LABEL[i.billing_cycle] : ""}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditing(i);
                        setEditOpen(true);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <ItemFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        item={editing}
        onSaved={() => {
          load();
          setSelected(null);
        }}
      />
    </AppShell>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-widest transition ${
        active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shift(setCursor: (fn: (d: Date) => Date) => void, by: number) {
  setCursor((d) => {
    const n = new Date(d);
    n.setMonth(n.getMonth() + by);
    return n;
  });
}
