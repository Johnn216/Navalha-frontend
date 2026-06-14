import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { Servico } from "@/compartilhado/tipos/entidades";

export async function listarServicos(unit_id: string) {
  return clienteApi.get<Servico[]>("/services", { params: { unit_id } });
}

export async function criarServico(dados: Partial<Servico>) {
  return clienteApi.post<Servico>("/services", dados);
}

export async function atualizarServico(id: string, dados: Partial<Servico>) {
  return clienteApi.patch<Servico>(`/services/${id}`, dados);
}

export async function excluirServico(id: string) {
  return clienteApi.delete(`/services/${id}`);
}
