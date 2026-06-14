import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/compartilhado/lib/utilitarios/cn";

export interface PropsEntrada extends InputHTMLAttributes<HTMLInputElement> {
  rotulo?: string;
  erro?: string;
}

export const Entrada = forwardRef<HTMLInputElement, PropsEntrada>(
  ({ className, rotulo, erro, id, ...props }, ref) => {
    const inputId = id ?? rotulo?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {rotulo && (
          <label htmlFor={inputId} className="font-mono text-xs uppercase tracking-wider text-ink-mute">
            {rotulo}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-[44px] w-full rounded-sm border border-rule bg-bg-soft px-3 py-2 text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
            erro && "border-danger",
            className
          )}
          {...props}
        />
        {erro && <span className="text-xs text-danger">{erro}</span>}
      </div>
    );
  }
);
Entrada.displayName = "Entrada";
