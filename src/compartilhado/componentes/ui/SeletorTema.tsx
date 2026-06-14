"use client";

import { CHAVE_TEMA, TEMAS, type TemaId } from "@/compartilhado/lib/constantes";
import { cn } from "@/compartilhado/lib/utilitarios/cn";

const SWATCHES: Record<TemaId, string> = {
  classico: "#C9A35E",
  moderno: "#00C896",
  terra: "#2A4A3B",
};

interface PropsSeletorTema {
  tema: TemaId;
  onTrocar: (tema: TemaId) => void;
  compacto?: boolean;
}

export function SeletorTema({ tema, onTrocar, compacto }: PropsSeletorTema) {
  return (
    <div
      className={cn("flex gap-1.5", compacto && "scale-90")}
      role="group"
      aria-label="Selecionar tema"
    >
      {TEMAS.map((t) => (
        <button
          key={t}
          type="button"
          className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-rule p-0"
          aria-pressed={tema === t}
          aria-label={`Tema ${t}`}
          onClick={() => onTrocar(t)}
        >
          <span
            className="block h-3.5 w-3.5 rounded-full"
            style={{ background: SWATCHES[t] }}
          />
        </button>
      ))}
    </div>
  );
}

export function aplicarTema(tema: TemaId) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem(CHAVE_TEMA, tema);
  }
}

export function obterTemaSalvo(): TemaId {
  if (typeof window === "undefined") return "classico";
  const salvo = localStorage.getItem(CHAVE_TEMA) as TemaId | null;
  return salvo && TEMAS.includes(salvo) ? salvo : "classico";
}
