import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { mockAuth, mockItems } from "@/lib/mock";
import { BarChart3, Calendar, LayoutDashboard, ListChecks, LogOut, Plus, Search, Settings as SettingsIcon } from "lucide-react";
import { TYPE_META, type ItemType } from "@/lib/items";

type ItemHit = { id: string; name: string; type: ItemType; vendor: string | null };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<ItemHit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    setItems(
      mockItems.list().slice(0, 50).map((i) => ({
        id: i.id, name: i.name, type: i.type, vendor: i.vendor,
      })),
    );
  }, [open]);

  function go(to: string) {
    setOpen(false);
    setQuery("");
    navigate({ to });
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-start bg-background/60 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl">
            <Command label="Command palette" className="glass-card rounded-2xl border border-border shadow-2xl">
              <div className="flex items-center gap-2 border-b border-border px-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search items, jump to a page…"
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">ESC</kbd>
              </div>
              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No results.
                </Command.Empty>

                <Command.Group heading="Jump to" className="px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground">
                  <Row icon={LayoutDashboard} label="Dashboard" onSelect={() => go("/dashboard")} />
                  <Row icon={ListChecks} label="Registry" onSelect={() => go("/items")} />
                  <Row icon={Calendar} label="Calendar" onSelect={() => go("/calendar")} />
                  <Row icon={BarChart3} label="Analytics" onSelect={() => go("/analytics")} />
                  <Row icon={SettingsIcon} label="Settings" onSelect={() => go("/settings")} />
                </Command.Group>

                <Command.Group heading="Actions" className="px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground">
                  <Row icon={Plus} label="Add new item" onSelect={() => go("/items")} />
                  <Row
                    icon={LogOut}
                    label="Sign out"
                    onSelect={() => {
                      setOpen(false);
                      mockAuth.signOut();
                      navigate({ to: "/" });
                    }}
                  />
                </Command.Group>

                {items.length > 0 && (
                  <Command.Group heading="Items" className="px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground">
                    {items.map((it) => (
                      <Command.Item
                        key={it.id}
                        value={`${it.name} ${it.vendor ?? ""} ${it.type}`}
                        onSelect={() => go("/items")}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-muted"
                      >
                        <span className="text-base">{TYPE_META[it.type].emoji}</span>
                        <div className="flex-1 truncate">
                          <div className="truncate">{it.name}</div>
                          {it.vendor && <div className="truncate text-xs text-muted-foreground">{it.vendor}</div>}
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {TYPE_META[it.type].label}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ icon: Icon, label, onSelect }: { icon: typeof LayoutDashboard; label: string; onSelect: () => void }) {
  return (
    <Command.Item
      value={label}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-muted"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </Command.Item>
  );
}
