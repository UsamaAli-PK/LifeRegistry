import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { mockAuth } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mockAuth.getUser()) {
      navigate({ to: "/auth" });
      return;
    }
    setReady(true);
    const off = mockAuth.onChange((u) => {
      if (!u) navigate({ to: "/auth" });
    });
    return () => { off(); };
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">loading…</div>
      </div>
    );
  }
  return <Outlet />;
}
