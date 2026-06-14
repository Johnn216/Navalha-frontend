import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { CartaoFidelidade } from "@/compartilhado/tipos/entidades";

export async function obterFidelidade(clientId: string) {
  return clienteApi.get<CartaoFidelidade>(`/clients/${clientId}/loyalty`);
}

export async function resgatarFidelidade(clientId: string) {
  return clienteApi.post<CartaoFidelidade>(
    `/clients/${clientId}/loyalty/redeem`
  );
}
