import Papa from "papaparse";
import type { ItemRow } from "@/components/app/ItemFormDialog";

export function exportItemsToCSV(items: ItemRow[]) {
  const rows = items.map((i) => ({
    name: i.name,
    type: i.type,
    vendor: i.vendor ?? "",
    cost: i.cost ?? 0,
    currency: i.currency ?? "USD",
    billing_cycle: i.billing_cycle ?? "",
    renewal_date: i.renewal_date ?? "",
    expiry_date: i.expiry_date ?? "",
    status: i.status ?? "active",
    url: i.url ?? "",
    account_email: i.account_email ?? "",
    tags: (i.tags ?? []).join("|"),
    notes: i.notes ?? "",
  }));
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `liferegistry-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export type ImportRow = Record<string, string>;

export function parseCSV(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<ImportRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: (err) => reject(err),
    });
  });
}
