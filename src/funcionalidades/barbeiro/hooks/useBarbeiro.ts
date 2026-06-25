import { useQuery } from "@tanstack/react-query";
import { listarAgendamentos } from "@/compartilhado/lib/api/servicos/agendamentos.servico";
import { listarBarbeiros } from "@/compartilhado/lib/api/servicos/barbeiros.servico";
import { listarLancamentosComissao } from "@/compartilhado/lib/api/servicos/comissao.servico";
import type { Agendamento, StatusAgendamento } from "@/compartilhado/tipos/entidades";
import { chavesConsultaBarbeiro } from "@/funcionalidades/barbeiro/chaves-consulta";

const TAXA_COMISSAO_PADRAO = 0.4;

const STATUS_PROXIMO: StatusAgendamento[] = ["PENDING", "CONFIRMED", "IN_SERVICE"];

export function calcularComissaoFallback(
  agendamentos: Agendamento[],
  barbeiroId: string,
  periodo: string
): number {
  return agendamentos
    .filter(
      (a) =>
        a.barber_id === barbeiroId &&
        a.status === "PAID" &&
        a.starts_at.startsWith(periodo)
    )
    .reduce((soma, a) => soma + Math.round(a.total_cents * TAXA_COMISSAO_PADRAO), 0);
}

export function obterProximoAgendamento(
  agendamentos: Agendamento[],
  agora = new Date()
): Agendamento | null {
  return (
    [...agendamentos]
      .filter(
        (a) =>
          STATUS_PROXIMO.includes(a.status) &&
          new Date(a.starts_at).getTime() > agora.getTime()
      )
      .sort(
        (a, b) =>
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      )[0] ?? null
  );
}

export function useBarbeiroAtual(unitId: string, userId: string) {
  return useQuery({
    queryKey: chavesConsultaBarbeiro.barbeiros(unitId),
    queryFn: () => listarBarbeiros(unitId),
    enabled: !!unitId && !!userId,
    select: (barbeiros) => barbeiros.find((b) => b.user_id === userId) ?? null,
  });
}

export function useAgendamentosDoBarbeiro(
  unitId: string,
  barbeiroId: string,
  data: string
) {
  return useQuery({
    queryKey: chavesConsultaBarbeiro.agendamentos(barbeiroId, data),
    queryFn: () =>
      listarAgendamentos({
        unit_id: unitId,
        date: data,
        barber_id: barbeiroId,
      }),
    enabled: !!unitId && !!barbeiroId && !!data,
  });
}

export function useComissaoBarbeiro(barbeiroId: string, periodo: string) {
  return useQuery({
    queryKey: chavesConsultaBarbeiro.comissao(barbeiroId, periodo),
    queryFn: () =>
      listarLancamentosComissao({ barber_id: barbeiroId, period: periodo }),
    enabled: !!barbeiroId && !!periodo,
    retry: false,
  });
}
