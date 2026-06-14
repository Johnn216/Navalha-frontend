import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/compartilhado/lib/utilitarios/cn";

const variantesBotao = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px]",
  {
    variants: {
      variante: {
        primario: "bg-accent text-accent-ink hover:bg-hl",
        secundario: "border border-rule bg-bg-soft text-ink hover:bg-bg-elev",
        fantasma: "text-ink-soft hover:text-ink hover:bg-bg-soft",
        perigo: "bg-danger text-white hover:opacity-90",
      },
      tamanho: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3 text-base",
      },
    },
    defaultVariants: {
      variante: "primario",
      tamanho: "md",
    },
  }
);

export interface PropsBotao
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variantesBotao> {}

export const Botao = forwardRef<HTMLButtonElement, PropsBotao>(
  ({ className, variante, tamanho, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variantesBotao({ variante, tamanho }), className)}
      {...props}
    />
  )
);
Botao.displayName = "Botao";
