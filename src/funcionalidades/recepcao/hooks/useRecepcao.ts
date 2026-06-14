import { useQuery } from "@tanstack/react-query";
import { listarAgendamentos } from "@/compartilhado/lib/api/servicos/agendamentos.servico";
import { listarFilaEspera } from "@/compartilhado/lib/api/servicos/clientes.servico";
import { obterSessaoCaixaAtual } from "@/compartilhado/lib/api/servicos/caixa.servico";
import { listarInboxWhatsApp } from "@/compartilhado/lib/api/servicos/notificacoes.servico";
import { listarProdutos } from "@/compartilhado/lib/api/servicos/produtos.servico";

export const chavesConsultaRecepcao = {
  agendamentos: (unitId: string, date: string) =>
    ["recepcao", "agendamentos", unitId, date] as const,
  fila: (unitId: string) => ["recepcao", "fila", unitId] as const,
  caixa: (unitId: string) => ["recepcao", "caixa", unitId] as const,
  whatsapp: (unitId: string) => ["recepcao", "whatsapp", unitId] as const,
  estoque: (unitId: string) => ["recepcao", "estoque", unitId] as const,
};

export function useAgendamentosDoDia(unitId: string, date: string) {
  return useQuery({
    queryKey: chavesConsultaRecepcao.agendamentos(unitId, date),
    queryFn: () => listarAgendamentos({ unit_id: unitId, date }),
  });
}

export function useFilaEspera(unitId: string) {
  return useQuery({
    queryKey: chavesConsultaRecepcao.fila(unitId),
    queryFn: () => listarFilaEspera(unitId),
  });
}

export function useCaixaAtual(unitId: string) {
  return useQuery({
    queryKey: chavesConsultaRecepcao.caixa(unitId),
    queryFn: () => obterSessaoCaixaAtual(unitId),
  });
}

export function useInboxWhatsApp(unitId: string) {
  return useQuery({
    queryKey: chavesConsultaRecepcao.whatsapp(unitId),
    queryFn: () => listarInboxWhatsApp(unitId),
  });
}

export function useEstoque(unitId: string) {
  return useQuery({
    queryKey: chavesConsultaRecepcao.estoque(unitId),
    queryFn: () => listarProdutos(unitId),
  });
}
