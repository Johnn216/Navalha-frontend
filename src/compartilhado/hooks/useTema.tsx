"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  aplicarTema,
  obterTemaSalvo,
} from "@/compartilhado/componentes/ui/SeletorTema";
import type { TemaId } from "@/compartilhado/lib/constantes";

interface ContextoTema {
  tema: TemaId;
  trocarTema: (tema: TemaId) => void;
}

const TemaContext = createContext<ContextoTema | null>(null);

export function ProvedorTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<TemaId>("classico");
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    const salvo = obterTemaSalvo();
    setTema(salvo);
    aplicarTema(salvo);
    setMontado(true);
  }, []);

  const trocarTema = useCallback((novo: TemaId) => {
    setTema(novo);
    aplicarTema(novo);
  }, []);

  if (!montado) return null;

  return (
    <TemaContext.Provider value={{ tema, trocarTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error("useTema deve ser usado dentro de ProvedorTema");
  return ctx;
}
