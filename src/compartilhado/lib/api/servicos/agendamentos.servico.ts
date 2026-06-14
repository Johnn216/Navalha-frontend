import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { RespostaPaginada } from "@/compartilhado/tipos/api";
import type {
  Agendamento,
  StatusAgendamento,
} from "@/compartilhado/tipos/entidades";
import type { RespostaRiscoNoShow } from "@/compartilhado/tipos/api";

export interface ListarAgendamentosParams {
  unit_id: string;
  date?: string;
  barber_id?: string;
  status?: StatusAgendamento;
  page?: number;
  limit?: number;
}

export async function listarAgendamentos(params: ListarAgendamentosParams) {
  return clienteApi.get<RespostaPaginada<Agendamento>>("/appointments", {
    params,
  });
}

export async function obterAgendamento(id: string) {
  return clienteApi.get<Agendamento>(`/appointments/${id}`);
}

export async function criarAgendamento(dados: {
  unit_id: string;
  client: { phone: string; name: string };
  barber_id: string;
  service_ids: string[];
  starts_at: string;
  source: string;
}) {
  return clienteApi.post<Agendamento>("/appointments", dados);
}

export async function atualizarStatusAgendamento(
  id: string,
  status: StatusAgendamento
) {
  return clienteApi.patch<Agendamento>(`/appointments/${id}/status`, {
    status,
  });
}

export async function confirmarAgendamento(id: string) {
  return clienteApi.post(`/appointments/${id}/confirm`);
}

export async function cancelarAgendamento(id: string) {
  return clienteApi.post(`/appointments/${id}/cancel`);
}

export async function obterRiscoNoShow(id: string) {
  return clienteApi.get<RespostaRiscoNoShow>(`/appointments/${id}/risk`);
}

export async function obterSugestoesOverbook(unit_id: string, date: string) {
  return clienteApi.get<{ suggestions: unknown[] }>("/overbook/suggestions", {
    params: { unit_id, date },
  });
}
