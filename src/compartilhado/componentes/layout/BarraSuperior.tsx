"use client";

import { SeletorTema } from "@/compartilhado/componentes/ui/SeletorTema";
import { useTema } from "@/compartilhado/hooks/useTema";

export function BarraSuperior({ titulo }: { titulo: string }) {
  const { tema, trocarTema } = useTema();

  return (
    <header className="flex items-center justify-between border-b border-rule bg-bg/90 px-6 py-4 backdrop-blur-md lg:hidden">
      <span className="font-serif text-lg font-semibold">{titulo}</span>
      <SeletorTema tema={tema} onTrocar={trocarTema} compacto />
    </header>
  );
}
