import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { Cliente, Agendamento } from "@/compartilhado/tipos/entidades";
import type { RespostaPaginada } from "@/compartilhado/tipos/api";

export async function listarClientes(params?: { q?: string; segment?: string }) {
  return clienteApi.get<RespostaPaginada<Cliente>>("/clients", { params });
}

export async function obterCliente(id: string) {
  return clienteApi.get<Cliente>(`/clients/${id}`);
}

export async function atualizarCliente(id: string, dados: Partial<Cliente>) {
  return clienteApi.patch<Cliente>(`/clients/${id}`, dados);
}

export async function obterHistoricoCliente(id: string) {
  return clienteApi.get<Agendamento[]>(`/clients/${id}/history`);
}

export async function listarFilaEspera(unit_id: string) {
  return clienteApi.get<import("@/compartilhado/tipos/entidades").ItemFilaEspera[]>(
    "/waitlist",
    { params: { unit_id } }
  );
}

export async function entrarFilaEspera(dados: {
  unit_id: string;
  client: { phone: string; name: string };
  service_id: string;
  preferred_barber_id?: string;
}) {
  return clienteApi.post("/waitlist", dados);
}
