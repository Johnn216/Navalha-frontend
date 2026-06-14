"use client";

import type { ReactNode } from "react";

import { SeletorTema } from "@/compartilhado/componentes/ui/SeletorTema";
import { useTema } from "@/compartilhado/hooks/useTema";

export function BarraLateral({
  children,
  titulo,
}: {
  children: ReactNode;
  titulo: string;
}) {
  const { tema, trocarTema } = useTema();

  return (
    <aside className="hidden w-[240px] shrink-0 border-r border-rule bg-bg-soft lg:flex lg:flex-col">
      <div className="flex items-center justify-between border-b border-rule px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full border border-accent font-serif text-lg italic text-accent">
            N
          </span>
          <span className="font-serif text-sm font-semibold tracking-widest">{titulo}</span>
        </div>
        <SeletorTema tema={tema} onTrocar={trocarTema} compacto />
      </div>
      {children}
    </aside>
  );
}
