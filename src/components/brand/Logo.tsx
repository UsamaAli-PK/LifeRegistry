import logo from "@/assets/liferegistry-logo.png.asset.json";

export function Logo({
  className = "h-8 w-8",
  withWordmark = false,
  wordmarkClassName = "text-lg font-bold tracking-tight",
}: {
  className?: string;
  withWordmark?: boolean;
  wordmarkClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <img src={logo.url} alt="LifeRegistry" className={className} loading="eager" />
      {withWordmark && (
        <span className={wordmarkClassName}>
          <span className="text-foreground">Life</span>
          <span className="text-brand-gradient">Registry</span>
        </span>
      )}
    </div>
  );
}
