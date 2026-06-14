"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Unidade } from "@/compartilhado/tipos/entidades";
import { UNIT_CENTRO_ID } from "@/compartilhado/mocks/dados-sementes";

interface ContextoUnidade {
  unidadeId: string;
  unidade: Unidade | null;
  definirUnidade: (id: string) => void;
}

const UnidadeContext = createContext<ContextoUnidade | null>(null);

export function ProvedorUnidadeAtiva({ children }: { children: ReactNode }) {
  const [unidadeId, setUnidadeId] = useState(UNIT_CENTRO_ID);

  return (
    <UnidadeContext.Provider
      value={{
        unidadeId,
        unidade: null,
        definirUnidade: setUnidadeId,
      }}
    >
      {children}
    </UnidadeContext.Provider>
  );
}

export function useUnidadeAtiva() {
  const ctx = useContext(UnidadeContext);
  if (!ctx) throw new Error("useUnidadeAtiva requer ProvedorUnidadeAtiva");
  return ctx;
}
