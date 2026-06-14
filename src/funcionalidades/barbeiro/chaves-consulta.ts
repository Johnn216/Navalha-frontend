export const chavesConsultaBarbeiro = {
  agendamentos: (barbeiroId: string, data: string) =>
    ["barbeiro", "agendamentos", barbeiroId, data] as const,
  comissao: (barbeiroId: string, periodo: string) =>
    ["barbeiro", "comissao", barbeiroId, periodo] as const,
  portfolio: (barbeiroId: string) => ["barbeiro", "portfolio", barbeiroId] as const,
};
