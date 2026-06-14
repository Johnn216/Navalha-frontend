"use client";

import { useQuery } from "@tanstack/react-query";

import { listarAgendamentos } from "@/compartilhado/lib/api/servicos/agendamentos.servico";
import { UNIT_CENTRO_ID } from "@/compartilhado/mocks/dados-sementes";

export function useAgendamentosDemo(data?: string) {
  const dataConsulta = data ?? new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["agendamentos", "demo", UNIT_CENTRO_ID, dataConsulta],
    queryFn: () =>
      listarAgendamentos({ unit_id: UNIT_CENTRO_ID, date: dataConsulta }),
  });
}
