import { cn } from "@/compartilhado/lib/utilitarios/cn";

export interface PropsCartao {
  children: React.ReactNode;
  className?: string;
  titulo?: string;
  acoes?: React.ReactNode;
}

export function Cartao({ children, className, titulo, acoes }: PropsCartao) {
  return (
    <div className={cn("rounded-lg border border-rule bg-bg-card p-5", className)}>
      {(titulo || acoes) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {titulo && <h3 className="font-serif text-xl text-ink">{titulo}</h3>}
          {acoes}
        </div>
      )}
      {children}
    </div>
  );
}
