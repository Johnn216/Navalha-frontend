import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type {
  RespostaAutenticacao,
  RespostaMe,
} from "@/compartilhado/tipos/api";

export async function cadastrar(dados: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  return clienteApi.post<RespostaAutenticacao>("/auth/signup", dados, {
    auth: false,
  });
}

export async function entrar(dados: { email: string; password: string }) {
  return clienteApi.post<RespostaAutenticacao>("/auth/login", dados, {
    auth: false,
  });
}

export async function obterMe() {
  return clienteApi.get<RespostaMe>("/me");
}

export async function renovarToken(refresh_token: string) {
  return clienteApi.post<RespostaAutenticacao>(
    "/auth/refresh",
    { refresh_token },
    { auth: false }
  );
}
