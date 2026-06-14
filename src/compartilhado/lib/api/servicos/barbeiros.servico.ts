import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { Barbeiro } from "@/compartilhado/tipos/entidades";

export async function listarBarbeiros(unit_id: string) {
  return clienteApi.get<Barbeiro[]>("/barbers", { params: { unit_id } });
}

export async function obterBarbeiro(id: string) {
  return clienteApi.get<Barbeiro>(`/barbers/${id}`);
}

export async function criarTurno(
  barberId: string,
  dados: { weekday: number; start: string; end: string; unit_id: string }
) {
  return clienteApi.post(`/barbers/${barberId}/shifts`, dados);
}

export async function criarBloqueio(
  barberId: string,
  dados: { starts_at: string; ends_at: string; reason: string }
) {
  return clienteApi.post(`/barbers/${barberId}/blocks`, dados);
}

export async function excluirBloqueio(barberId: string, blockId: string) {
  return clienteApi.delete(`/barbers/${barberId}/blocks/${blockId}`);
}
