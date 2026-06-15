import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  obterOnboarding,
  salvarPassoOnboarding,
  publicarOnboarding,
} from "@/compartilhado/lib/api/servicos/onboarding.servico";
import { listarServicos } from "@/compartilhado/lib/api/servicos/servicos.servico";

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

export function useServicosOnboarding(unitId: string) {
  return useQuery({
    queryKey: chavesConsultaOnboarding.servicos(unitId),
    queryFn: () => listarServicos(unitId),
    enabled: !!unitId,
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
