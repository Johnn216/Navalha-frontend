import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/compartilhado/lib/utilitarios/cn";

const variantesSelo = cva(
  "inline-flex items-center rounded-sm font-mono text-[10px] uppercase tracking-widest px-2 py-0.5",
  {
    variants: {
      variante: {
        padrao: "border border-rule text-ink-soft bg-bg-soft",
        accent: "bg-accent/15 text-accent border border-accent/30",
        ok: "bg-ok/15 text-ok border border-ok/30",
        perigo: "bg-danger/15 text-danger border border-danger/30",
        aviso: "bg-warn/15 text-warn border border-warn/30",
      },
    },
    defaultVariants: { variante: "padrao" },
  }
);

export interface PropsSelo extends VariantProps<typeof variantesSelo> {
  children: React.ReactNode;
  className?: string;
}

export function Selo({ children, variante, className }: PropsSelo) {
  return <span className={cn(variantesSelo({ variante }), className)}>{children}</span>;
}
