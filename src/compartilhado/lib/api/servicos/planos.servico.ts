import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { PlanoClube } from "@/compartilhado/tipos/entidades";

export async function listarPlanos() {
  return clienteApi.get<PlanoClube[]>("/plans");
}

export async function criarPlano(dados: Partial<PlanoClube>) {
  return clienteApi.post<PlanoClube>("/plans", dados);
}

export async function criarAssinatura(dados: {
  client_id: string;
  plan_id: string;
  card_token: string;
}) {
  return clienteApi.post("/subscriptions", dados);
}

export async function cancelarAssinatura(id: string) {
  return clienteApi.delete(`/subscriptions/${id}`);
}
