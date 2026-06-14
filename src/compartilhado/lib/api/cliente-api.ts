import type { ErroApi, RespostaPaginada } from "@/compartilhado/tipos/api";
import { CHAVE_TOKEN } from "@/compartilhado/lib/constantes";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

type ParamsQuery = object;

export class ErroClienteApi extends Error {
  constructor(
    public codigo: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ErroClienteApi";
  }
}

function obterToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CHAVE_TOKEN);
}

function montarUrl(
  caminho: string,
  params?: ParamsQuery
): string {
  const url = new URL(
    caminho.startsWith("http") ? caminho : `${BASE_URL}${caminho}`
  );
  if (params) {
    Object.entries(params as Record<string, unknown>).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function tratarResposta<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;

  const corpo = await res.json().catch(() => null);

  if (!res.ok) {
    const erro = corpo as ErroApi | null;
    throw new ErroClienteApi(
      erro?.error?.code ?? "ERRO_DESCONHECIDO",
      erro?.error?.message ?? res.statusText,
      res.status
    );
  }

  return corpo as T;
}

async function requisicao<T>(
  metodo: string,
  caminho: string,
  opcoes?: {
    params?: ParamsQuery;
    body?: unknown;
    auth?: boolean;
  }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (opcoes?.auth !== false) {
    const token = obterToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(montarUrl(caminho, opcoes?.params), {
    method: metodo,
    headers,
    body: opcoes?.body ? JSON.stringify(opcoes.body) : undefined,
  });

  if (res.status === 401 && opcoes?.auth !== false) {
    const refresh = localStorage.getItem("navalha-refresh");
    if (refresh) {
      try {
        const tokens = await clienteApi.post<{
          access_token: string;
          refresh_token: string;
        }>("/auth/refresh", { refresh_token: refresh }, { auth: false });
        localStorage.setItem(CHAVE_TOKEN, tokens.access_token);
        localStorage.setItem("navalha-refresh", tokens.refresh_token);
        headers.Authorization = `Bearer ${tokens.access_token}`;
        const retry = await fetch(montarUrl(caminho, opcoes?.params), {
          method: metodo,
          headers,
          body: opcoes?.body ? JSON.stringify(opcoes.body) : undefined,
        });
        return tratarResposta<T>(retry);
      } catch {
        localStorage.removeItem(CHAVE_TOKEN);
        localStorage.removeItem("navalha-refresh");
      }
    }
  }

  return tratarResposta<T>(res);
}

export const clienteApi = {
  get<T>(
    caminho: string,
    opcoes?: {
      params?: ParamsQuery;
      auth?: boolean;
    }
  ) {
    return requisicao<T>("GET", caminho, opcoes);
  },

  post<T>(
    caminho: string,
    body?: unknown,
    opcoes?: { auth?: boolean; params?: ParamsQuery }
  ) {
    return requisicao<T>("POST", caminho, { body, ...opcoes });
  },

  patch<T>(caminho: string, body?: unknown) {
    return requisicao<T>("PATCH", caminho, { body });
  },

  delete<T>(caminho: string) {
    return requisicao<T>("DELETE", caminho);
  },
};

export type { RespostaPaginada };
