import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { SlotDisponibilidade } from "@/compartilhado/tipos/entidades";

export async function obterDisponibilidade(params: {
  unit_id: string;
  barber_id: string;
  service_id: string;
  date: string;
}) {
  return clienteApi.get<SlotDisponibilidade[]>("/availability", { params });
}
