"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { ProvedorTema } from "@/compartilhado/hooks/useTema";
import { ProvedorAutenticacao } from "@/funcionalidades/autenticacao";
import { ProvedorUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";
import { iniciarMocks } from "@/compartilhado/mocks/iniciar-mocks";

export function Provedores({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      })
  );
  
  const [mocksProntos, setMocksProntos] = useState(
    process.env.NEXT_PUBLIC_USAR_MOCKS !== "true"
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USAR_MOCKS === "true") {
      iniciarMocks().then(() => {
        setMocksProntos(true);
      });
    }
  }, []);

  if (!mocksProntos) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ProvedorTema>
        <ProvedorAutenticacao>
          <ProvedorUnidadeAtiva>{children}</ProvedorUnidadeAtiva>
        </ProvedorAutenticacao>
      </ProvedorTema>
    </QueryClientProvider>
  );
}
