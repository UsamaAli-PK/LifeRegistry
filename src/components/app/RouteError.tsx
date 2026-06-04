import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="glass-card flex flex-col items-center gap-4 rounded-3xl border border-dashed border-brand-coral/40 p-10 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-coral/15 text-brand-coral">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h2 className="font-display text-2xl font-bold tracking-tight">Something broke loading this page</h2>
        <p className="max-w-md text-sm text-muted-foreground">{error.message || "Unknown error"}</p>
        <Button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
