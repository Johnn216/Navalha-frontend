"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Unidade } from "@/compartilhado/tipos/entidades";
import { useSessao } from "@/funcionalidades/autenticacao/hooks/useSessao";

interface ContextoUnidade {
  unidadeId: string;
  unidade: Unidade | null;
  definirUnidade: (id: string) => void;
}

const UnidadeContext = createContext<ContextoUnidade | null>(null);

export function ProvedorUnidadeAtiva({ children }: { children: ReactNode }) {
  const { unidades } = useSessao();
  const [unidadeId, setUnidadeId] = useState("");

  useEffect(() => {
    if (unidades.length > 0) {
      setUnidadeId((atual) => atual || unidades[0].id);
    }
  }, [unidades]);

  const unidade = unidades.find((u) => u.id === unidadeId) ?? null;

  return (
    <UnidadeContext.Provider
      value={{
        unidadeId,
        unidade,
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
