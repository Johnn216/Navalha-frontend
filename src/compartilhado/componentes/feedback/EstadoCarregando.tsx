import { cn } from "@/compartilhado/lib/utilitarios/cn";

export function EstadoCarregando({
  mensagem = "Carregando...",
  className,
  esqueleto = false,
}: {
  mensagem?: string;
  className?: string;
  esqueleto?: boolean;
}) {
  if (esqueleto) {
    return (
      <div className={cn("space-y-4", className)} aria-busy="true" role="status">
        {/* KPI skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border border-rule bg-bg-card"
            />
          ))}
        </div>
        {/* Card skeleton */}
        <div className="h-64 animate-pulse rounded-lg border border-rule bg-bg-card" />
        <div className="h-48 animate-pulse rounded-lg border border-rule bg-bg-card" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-20 text-ink-soft",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Navalha spinner — barber pole circular */}
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-2 border-rule" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
        <div className="absolute inset-[6px] flex items-center justify-center rounded-full border border-rule font-serif italic text-accent text-sm">
          N
        </div>
      </div>
      <p className="font-mono text-sm tracking-wider">{mensagem}</p>
    </div>
  );
}
