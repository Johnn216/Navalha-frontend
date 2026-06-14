import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type {
  Agendamento,
  PerfilPublicoUnidade,
  SlotDisponibilidade,
  Barbeiro,
} from "@/compartilhado/tipos/entidades";
import type { RespostaPaginada } from "@/compartilhado/tipos/api";

export async function obterPerfilPublicoUnidade(unitSlug: string) {
  return clienteApi.get<PerfilPublicoUnidade>(`/public/u/${unitSlug}`, {
    auth: false,
  });
}

export async function obterDisponibilidadePublica(
  unitSlug: string,
  params: { barber_id: string; service_id: string; date: string }
) {
  return clienteApi.get<SlotDisponibilidade[]>(
    `/public/u/${unitSlug}/availability`,
    { params, auth: false }
  );
}

export async function reservarPublico(
  unitSlug: string,
  dados: {
    client: { phone: string; name: string };
    barber_id: string;
    service_ids: string[];
    starts_at: string;
  }
) {
  return clienteApi.post<Agendamento>(`/public/u/${unitSlug}/book`, dados, {
    auth: false,
  });
}

export async function obterPerfilPublicoBarbeiro(barberSlug: string) {
  return clienteApi.get<Barbeiro>(`/public/b/${barberSlug}`, { auth: false });
}

export async function buscarMarketplace(params?: {
  city?: string;
  q?: string;
  page?: number;
}) {
  return clienteApi.get<RespostaPaginada<PerfilPublicoUnidade>>(
    "/public/marketplace",
    { params, auth: false }
  );
}
