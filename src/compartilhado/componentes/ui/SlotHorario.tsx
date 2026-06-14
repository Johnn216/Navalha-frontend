import { cn } from "@/compartilhado/lib/utilitarios/cn";

export interface PropsSlotHorario {
  hora: string;
  selecionado?: boolean;
  indisponivel?: boolean;
  onClick?: () => void;
}

export function SlotHorario({
  hora,
  selecionado,
  indisponivel,
  onClick,
}: PropsSlotHorario) {
  return (
    <button
      type="button"
      disabled={indisponivel}
      onClick={onClick}
      aria-pressed={selecionado}
      className={cn(
        "min-h-[44px] rounded-sm border font-mono text-sm tabular-nums transition-colors",
        indisponivel && "cursor-not-allowed border-rule/50 text-ink-mute/50 line-through",
        !indisponivel && !selecionado && "border-rule bg-bg-soft text-ink hover:border-accent",
        selecionado && "border-accent bg-accent/15 text-accent"
      )}
    >
      {hora}
    </button>
  );
}
