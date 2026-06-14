import { cn } from "@/compartilhado/lib/utilitarios/cn";

export function DivisorBarbearia({ className }: { className?: string }) {
  return (
    <div className={cn("relative my-6", className)}>
      <div className="barber-pole w-full" />
    </div>
  );
}
