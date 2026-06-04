import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { mockItems } from "@/lib/mock";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ItemFormDialog, type ItemRow } from "@/components/app/ItemFormDialog";
import {
  CYCLE_LABEL,
  ITEM_TYPES,
  TYPE_META,
  daysUntil,
  formatMoney,
  type ItemType,
} from "@/lib/items";
import { Download, ExternalLink, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { CardGridSkeleton } from "@/components/app/Skeleton";
import { RouteError } from "@/components/app/RouteError";
import { exportItemsToCSV } from "@/lib/csv";

export const Route = createFileRoute("/_authenticated/items")({
  head: () => ({
    meta: [
      { title: "Registry — LifeRegistry" },
      { name: "description", content: "Every subscription, warranty, account, and renewal you track — in one searchable registry." },
    ],
  }),
  component: ItemsPage,
  errorComponent: RouteError,
});

function ItemsPage() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<ItemType | "all">("all");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ItemRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  function load() {
    setLoading(true);
    const data = mockItems.list().sort((a, b) => {
      if (!a.renewal_date) return 1;
      if (!b.renewal_date) return -1;
      return a.renewal_date.localeCompare(b.renewal_date);
    });
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (typeFilter !== "all" && i.type !== typeFilter) return false;
      if (q) {
        const s = q.toLowerCase();
        return (
          i.name.toLowerCase().includes(s) ||
          (i.vendor ?? "").toLowerCase().includes(s) ||
          (i.tags ?? []).some((t) => t.toLowerCase().includes(s))
        );
      }
      return true;
    });
  }, [items, q, typeFilter]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function confirmDelete() {
    if (!deleteId) return;
    mockItems.remove(deleteId);
    toast.success("Deleted");
    setDeleteId(null);
    load();
  }

  function bulkDelete() {
    const ids = Array.from(selected);
    mockItems.removeMany(ids);
    toast.success(`Deleted ${ids.length} item${ids.length === 1 ? "" : "s"}`);
    setBulkDeleteOpen(false);
    clearSelection();
    load();
  }

  function bulkSetStatus(status: "active" | "paused" | "cancelled" | "expired") {
    const ids = Array.from(selected);
    mockItems.setStatusMany(ids, status);
    toast.success(`Updated ${ids.length} item${ids.length === 1 ? "" : "s"}`);
    clearSelection();
    load();
  }

  function exportCSV() {
    if (filtered.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    exportItemsToCSV(filtered);
    toast.success(`Exported ${filtered.length} item${filtered.length === 1 ? "" : "s"}`);
  }

  return (
    <AppShell>
      <section className="relative overflow-hidden">
        <div className="bg-radial-hero pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brand-violet">
                / your registry
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                Everything you own & pay for.
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"} tracked.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={exportCSV}
                className="rounded-full"
              >
                <Download className="h-4 w-4" /> Export CSV
              </Button>
              <Button
                onClick={() => {
                  setEditing(null);
                  setEditOpen(true);
                }}
                className="rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90"
              >
                <Plus className="h-4 w-4" /> Add item
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, vendor, tag…"
                className="h-11 rounded-full pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ItemType | "all")}>
              <SelectTrigger className="h-11 w-40 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {ITEM_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {TYPE_META[t].emoji} {TYPE_META[t].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* List */}
          <div className="my-8 sm:my-10">
            {loading ? (
              <CardGridSkeleton count={6} />
            ) : filtered.length === 0 ? (
              <EmptyState onAdd={() => { setEditing(null); setEditOpen(true); }} hasAny={items.length > 0} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((i) => (
                  <ItemCard
                    key={i.id}
                    item={i}
                    selected={selected.has(i.id)}
                    onToggleSelect={() => toggleSelect(i.id)}
                    onEdit={() => { setEditing(i); setEditOpen(true); }}
                    onDelete={() => setDeleteId(i.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 sm:bottom-6">
          <div className="glass-card flex items-center gap-2 rounded-full border border-border px-3 py-2 shadow-xl">
            <span className="px-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {selected.size} selected
            </span>
            <Select onValueChange={(v) => bulkSetStatus(v as "active" | "paused" | "cancelled" | "expired")}>
              <SelectTrigger className="h-8 w-28 rounded-full text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setBulkDeleteOpen(true)}
              className="rounded-full text-brand-coral hover:bg-brand-coral/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
            <Button size="icon" variant="ghost" onClick={clearSelection} className="h-8 w-8 rounded-full" aria-label="Clear">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <ItemFormDialog open={editOpen} onOpenChange={setEditOpen} item={editing} onSaved={load} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} item{selected.size === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={bulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function ItemCard({ item, selected, onToggleSelect, onEdit, onDelete }: {
  item: ItemRow;
  selected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const meta = TYPE_META[item.type];
  const due = daysUntil(item.renewal_date ?? item.expiry_date);
  const dueLabel =
    due === null ? null : due < 0 ? `${Math.abs(due)}d overdue` : due === 0 ? "today" : `in ${due}d`;
  const dueTone =
    due === null ? "" : due < 0 ? "bg-brand-coral/15 text-brand-coral" : due <= 7 ? "bg-brand-amber/25 text-amber-700 dark:text-brand-amber" : "bg-brand-mint/15 text-brand-mint";

  return (
    <article className={`glass-card group relative rounded-3xl p-5 transition hover:-translate-y-0.5 ${selected ? "ring-2 ring-brand-violet" : ""}`}>
      <div className="absolute left-3 top-3 z-10">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggleSelect}
          aria-label={`Select ${item.name}`}
          className="border-border bg-background/80"
        />
      </div>
      <div className="flex items-start justify-between gap-3 pl-8">
        <div className="flex items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-2xl font-display text-lg ${meta.tone}`}>
            {meta.emoji}
          </span>
          <div>
            <h3 className="font-display text-lg font-bold leading-tight tracking-tight">{item.name}</h3>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {meta.label}{item.vendor ? ` · ${item.vendor}` : ""}
            </p>
          </div>
        </div>
        {dueLabel && (
          <span className={`sticker shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${dueTone}`}>
            {dueLabel}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight">
            {formatMoney(item.cost ?? 0, item.currency ?? "USD")}
            <span className="ml-1 text-sm font-medium text-muted-foreground">
              {item.billing_cycle ? CYCLE_LABEL[item.billing_cycle] : ""}
            </span>
          </p>
          {item.status !== "active" && (
            <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {item.status}
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer" className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button onClick={onEdit} className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="grid h-8 w-8 place-items-center rounded-full text-brand-coral hover:bg-muted">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {(item.tags ?? []).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags!.map((t) => (
            <span key={t} className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              #{t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function EmptyState({ onAdd, hasAny }: { onAdd: () => void; hasAny: boolean }) {
  return (
    <div className="glass-card flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border p-12 text-center">
      <span className="sticker tilt-sm-l rounded-full bg-brand-violet px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white">
        ✦ {hasAny ? "no matches" : "fresh registry"}
      </span>
      <h3 className="font-display text-3xl font-bold tracking-tight">
        {hasAny ? "Nothing matches that filter" : "Add your first item"}
      </h3>
      <p className="max-w-md text-sm text-muted-foreground">
        {hasAny
          ? "Try clearing the search or switching the type filter."
          : "Drop in a subscription, a warranty, a domain — anything you pay for or own."}
      </p>
      {!hasAny && (
        <Button onClick={onAdd} className="rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90">
          <Plus className="h-4 w-4" /> Add item
        </Button>
      )}
    </div>
  );
}
