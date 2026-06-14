import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  obterOnboarding,
  salvarPassoOnboarding,
  publicarOnboarding,
} from "@/compartilhado/lib/api/servicos/onboarding.servico";
import { listarServicos } from "@/compartilhado/lib/api/servicos/servicos.servico";
import { UNIT_CENTRO_ID } from "@/compartilhado/mocks/dados-sementes";

export const chavesConsultaOnboarding = {
  todos: ["onboarding"] as const,
  servicos: (unitId: string) => ["onboarding", "servicos", unitId] as const,
};

export function useOnboarding() {
  return useQuery({
    queryKey: chavesConsultaOnboarding.todos,
    queryFn: obterOnboarding,
  });
}

export function useServicosOnboarding() {
  return useQuery({
    queryKey: chavesConsultaOnboarding.servicos(UNIT_CENTRO_ID),
    queryFn: () => listarServicos(UNIT_CENTRO_ID),
  });
}

export function useSalvarPasso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ n, dados }: { n: number; dados: unknown }) =>
      salvarPassoOnboarding(n, dados),
    onSuccess: () => qc.invalidateQueries({ queryKey: chavesConsultaOnboarding.todos }),
  });
}

export function usePublicarOnboarding() {
  return useMutation({ mutationFn: publicarOnboarding });
}
