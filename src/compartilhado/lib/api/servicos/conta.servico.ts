import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { Unidade, TemaConta } from "@/compartilhado/tipos/entidades";

export async function obterTenant() {
  return clienteApi.get<{ id: string; name: string; theme: TemaConta; plan: string }>(
    "/tenant"
  );
}

export async function atualizarTenant(dados: { theme?: TemaConta; name?: string }) {
  return clienteApi.patch("/tenant", dados);
}

export async function listarUnidades() {
  return clienteApi.get<Unidade[]>("/units");
}

export async function criarUnidade(dados: Partial<Unidade>) {
  return clienteApi.post<Unidade>("/units", dados);
}

export async function atualizarUnidade(id: string, dados: Partial<Unidade>) {
  return clienteApi.patch<Unidade>(`/units/${id}`, dados);
}
