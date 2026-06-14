import { cn } from "@/compartilhado/lib/utilitarios/cn";

export interface PropsSeloKpi {
  rotulo: string;
  valor: string;
  delta?: string;
  deltaPositivo?: boolean;
  className?: string;
}

export function SeloKpi({
  rotulo,
  valor,
  delta,
  deltaPositivo,
  className,
}: PropsSeloKpi) {
  return (
    <div className={cn("rounded-lg border border-rule bg-bg-card p-4", className)}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
        {rotulo}
      </p>
      <p className="mt-1 font-serif text-3xl tabular-nums text-ink md:text-4xl">
        {valor}
      </p>
      {delta && (
        <p
          className={cn(
            "mt-1 font-mono text-xs tabular-nums",
            deltaPositivo ? "text-ok" : "text-danger"
          )}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
