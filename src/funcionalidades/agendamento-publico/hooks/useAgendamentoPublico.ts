import { useQuery, useMutation } from "@tanstack/react-query";
import {
  obterPerfilPublicoUnidade,
  obterDisponibilidadePublica,
  reservarPublico,
} from "@/compartilhado/lib/api/servicos/publico.servico";

export const chavesConsultaAgendamentoPublico = {
  perfil: (slug: string) => ["publico", "perfil", slug] as const,
  slots: (slug: string, barberId: string, serviceId: string, date: string) =>
    ["publico", "slots", slug, barberId, serviceId, date] as const,
};

export function usePerfilPublico(slug: string) {
  return useQuery({
    queryKey: chavesConsultaAgendamentoPublico.perfil(slug),
    queryFn: () => obterPerfilPublicoUnidade(slug),
  });
}

export function useDisponibilidadePublica(
  slug: string,
  barberId: string,
  serviceId: string,
  date: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: chavesConsultaAgendamentoPublico.slots(slug, barberId, serviceId, date),
    queryFn: () =>
      obterDisponibilidadePublica(slug, {
        barber_id: barberId,
        service_id: serviceId,
        date,
      }),
    enabled: enabled && !!barberId && !!serviceId && !!date,
  });
}

export function useConfirmarAgendamentoPublico(slug: string) {
  return useMutation({
    mutationFn: reservarPublico.bind(null, slug),
  });
}
