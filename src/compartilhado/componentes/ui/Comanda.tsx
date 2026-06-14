import { cn } from "@/compartilhado/lib/utilitarios/cn";
import { formatarBRL } from "@/compartilhado/lib/formatadores/moeda";

export interface PropsComanda {
  codigo: string;
  cliente: string;
  servico: string;
  horario: string;
  valorCentavos: number;
  status?: string;
  className?: string;
  rotacao?: number;
}

export function Comanda({
  codigo,
  cliente,
  servico,
  horario,
  valorCentavos,
  status,
  className,
  rotacao = 0,
}: PropsComanda) {
  return (
    <div
      className={cn(
        "ticket-notch relative rounded-md border border-dashed border-rule bg-bg-elev p-4 shadow-lg",
        className
      )}
      style={{ transform: `rotate(${rotacao}deg)` }}
    >
      <div className="mb-2 flex items-center justify-between font-mono text-xs text-ink-mute">
        <span>{codigo}</span>
        <span className="tabular-nums">{horario}</span>
      </div>
      <p className="font-serif text-lg text-ink">{cliente}</p>
      <p className="text-sm text-ink-soft">{servico}</p>
      <div className="mt-3 flex items-center justify-between border-t border-dashed border-rule pt-2">
        <span className="font-mono text-sm tabular-nums text-accent">
          {formatarBRL(valorCentavos)}
        </span>
        {status && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
