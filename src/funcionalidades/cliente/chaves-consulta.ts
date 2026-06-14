export const chavesConsultaCliente = {
  servicos: (unidadeId: string) => ["cliente", "servicos", unidadeId] as const,
  barbeiros: (unidadeId: string) => ["cliente", "barbeiros", unidadeId] as const,
  slots: (unidadeId: string, barbeiroId: string, servicoId: string, data: string) =>
    ["cliente", "slots", unidadeId, barbeiroId, servicoId, data] as const,
  fidelidade: (clienteId: string) => ["cliente", "fidelidade", clienteId] as const,
  planos: () => ["cliente", "planos"] as const,
};
