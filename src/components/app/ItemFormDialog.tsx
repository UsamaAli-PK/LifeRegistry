import { useState, useEffect } from "react";
import { mockItems } from "@/lib/mock";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BILLING_CYCLES,
  CYCLE_LABEL,
  ITEM_STATUSES,
  ITEM_TYPES,
  TYPE_META,
  type ItemType,
  type BillingCycle,
  type ItemStatus,
} from "@/lib/items";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export type ItemRow = {
  id: string;
  name: string;
  type: ItemType;
  vendor: string | null;
  cost: number | null;
  currency: string | null;
  billing_cycle: BillingCycle | null;
  renewal_date: string | null;
  expiry_date: string | null;
  account_email: string | null;
  url: string | null;
  notes: string | null;
  tags: string[] | null;
  status: ItemStatus;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ItemRow | null;
  onSaved?: () => void;
};

const empty = {
  name: "",
  type: "subscription" as ItemType,
  vendor: "",
  cost: "" as string,
  currency: "USD",
  billing_cycle: "monthly" as BillingCycle,
  renewal_date: "",
  expiry_date: "",
  account_email: "",
  url: "",
  notes: "",
  tags: "",
  status: "active" as ItemStatus,
};

export function ItemFormDialog({ open, onOpenChange, item, onSaved }: Props) {
  const [f, setF] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setF({
        name: item.name,
        type: item.type,
        vendor: item.vendor ?? "",
        cost: item.cost?.toString() ?? "",
        currency: item.currency ?? "USD",
        billing_cycle: (item.billing_cycle ?? "monthly") as BillingCycle,
        renewal_date: item.renewal_date ?? "",
        expiry_date: item.expiry_date ?? "",
        account_email: item.account_email ?? "",
        url: item.url ?? "",
        notes: item.notes ?? "",
        tags: (item.tags ?? []).join(", "),
        status: item.status,
      });
    } else {
      setF(empty);
    }
  }, [item, open]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Omit<ItemRow, "id"> = {
        name: f.name.trim(),
        type: f.type,
        vendor: f.vendor || null,
        cost: f.cost ? Number(f.cost) : 0,
        currency: f.currency || "USD",
        billing_cycle: f.billing_cycle,
        renewal_date: f.renewal_date || null,
        expiry_date: f.expiry_date || null,
        account_email: f.account_email || null,
        url: f.url || null,
        notes: f.notes || null,
        tags: f.tags
          ? f.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        status: f.status,
      };

      if (item) {
        mockItems.update(item.id, payload);
        toast.success("Updated (demo)");
      } else {
        mockItems.add(payload);
        toast.success("Added to registry (demo)");
      }
      onOpenChange(false);
      onSaved?.();
    } catch (err: any) {
      toast.error(err?.message || "Couldn't save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">
            {item ? "Edit item" : "Add to registry"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Name">
            <Input
              required
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              placeholder="Netflix, Geico, GitHub…"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <Select value={f.type} onValueChange={(v) => setF({ ...f, type: v as ItemType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      <span className="mr-1.5">{TYPE_META[t].emoji}</span>
                      {TYPE_META[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={f.status}
                onValueChange={(v) => setF({ ...f, status: v as ItemStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Vendor / provider">
            <Input
              value={f.vendor}
              onChange={(e) => setF({ ...f, vendor: e.target.value })}
              placeholder="Netflix, Inc."
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Cost">
              <Input
                type="number"
                step="0.01"
                value={f.cost}
                onChange={(e) => setF({ ...f, cost: e.target.value })}
                placeholder="0.00"
              />
            </Field>
            <Field label="Currency">
              <Input
                value={f.currency}
                onChange={(e) => setF({ ...f, currency: e.target.value.toUpperCase() })}
                maxLength={3}
              />
            </Field>
            <Field label="Cycle">
              <Select
                value={f.billing_cycle}
                onValueChange={(v) => setF({ ...f, billing_cycle: v as BillingCycle })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_CYCLES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CYCLE_LABEL[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Renews on">
              <Input
                type="date"
                value={f.renewal_date}
                onChange={(e) => setF({ ...f, renewal_date: e.target.value })}
              />
            </Field>
            <Field label="Expires on">
              <Input
                type="date"
                value={f.expiry_date}
                onChange={(e) => setF({ ...f, expiry_date: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Account email">
            <Input
              type="email"
              value={f.account_email}
              onChange={(e) => setF({ ...f, account_email: e.target.value })}
              placeholder="you@domain.com"
            />
          </Field>
          <Field label="URL">
            <Input
              value={f.url}
              onChange={(e) => setF({ ...f, url: e.target.value })}
              placeholder="https://…"
            />
          </Field>
          <Field label="Tags (comma separated)">
            <Input
              value={f.tags}
              onChange={(e) => setF({ ...f, tags: e.target.value })}
              placeholder="entertainment, family"
            />
          </Field>
          <Field label="Notes">
            <Textarea
              rows={3}
              value={f.notes}
              onChange={(e) => setF({ ...f, notes: e.target.value })}
              placeholder="Anything to remember…"
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              {saving ? <Loader2 className="animate-spin" /> : item ? "Save changes" : "Add item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
