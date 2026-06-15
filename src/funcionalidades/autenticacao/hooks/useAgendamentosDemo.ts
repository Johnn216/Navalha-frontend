"use client";

import { useQuery } from "@tanstack/react-query";

import { listarAgendamentos } from "@/compartilhado/lib/api/servicos/agendamentos.servico";
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";

export function useAgendamentosDemo(data?: string) {
  const { unidadeId } = useUnidadeAtiva();
  const dataConsulta = data ?? new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["agendamentos", "demo", unidadeId, dataConsulta],
    queryFn: () =>
      listarAgendamentos({ unit_id: unidadeId, date: dataConsulta }),
    enabled: !!unidadeId,
  });
}
