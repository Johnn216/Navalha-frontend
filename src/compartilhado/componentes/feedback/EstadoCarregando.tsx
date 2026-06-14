import { Loader2 } from "lucide-react";
import { cn } from "@/compartilhado/lib/utilitarios/cn";

export function EstadoCarregando({
  mensagem = "Carregando...",
  className,
}: {
  mensagem?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-ink-soft",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
      <p className="font-mono text-sm">{mensagem}</p>
    </div>
  );
}
