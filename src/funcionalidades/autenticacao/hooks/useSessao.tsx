"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obterMe } from "@/compartilhado/lib/api/servicos/autenticacao.servico";
import { CHAVE_TOKEN, ROTAS_POR_PAPEL } from "@/compartilhado/lib/constantes";
import type { PapelUsuario, Unidade, Usuario } from "@/compartilhado/tipos/entidades";

interface ContextoAuth {
  usuario: Usuario | null;
  papel: PapelUsuario | null;
  unidades: Unidade[];
  carregando: boolean;
  entrarComToken: (token: string, refresh?: string) => void;
  sair: () => void;
}

const AuthContext = createContext<ContextoAuth | null>(null);

function definirCookie(nome: string, valor: string) {
  const expira = new Date(Date.now() + 7 * 864e5).toUTCString();
  document.cookie = `${nome}=${encodeURIComponent(valor)}; path=/; expires=${expira}; SameSite=Lax`;
}

function removerCookie(nome: string) {
  document.cookie = `${nome}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function ProvedorAutenticacao({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [inicializado, setInicializado] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setToken(localStorage.getItem(CHAVE_TOKEN));
    setInicializado(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["sessao", "me"],
    queryFn: obterMe,
    enabled: !!token && inicializado,
    retry: false,
  });

  const entrarComToken = useCallback(
    (access: string, refresh?: string) => {
      localStorage.setItem(CHAVE_TOKEN, access);
      if (refresh) localStorage.setItem("navalha-refresh", refresh);
      definirCookie(CHAVE_TOKEN, access);
      setToken(access);
      queryClient.invalidateQueries({ queryKey: ["sessao"] });
    },
    [queryClient],
  );

  const sair = useCallback(() => {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem("navalha-refresh");
    removerCookie(CHAVE_TOKEN);
    setToken(null);
    queryClient.clear();
    router.push("/entrar");
  }, [queryClient, router]);

  return (
    <AuthContext.Provider
      value={{
        usuario: data?.user ?? null,
        papel: data?.role ?? null,
        unidades: data?.units ?? [],
        carregando: !inicializado || (!!token && isLoading),
        entrarComToken,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSessao() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSessao requer ProvedorAutenticacao");
  return ctx;
}

export function useRedirecionarPosLogin() {
  const router = useRouter();
  return (papel: PapelUsuario) => {
    router.push(ROTAS_POR_PAPEL[papel] ?? "/");
  };
}
