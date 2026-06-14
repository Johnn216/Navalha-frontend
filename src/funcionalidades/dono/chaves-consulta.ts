export const chavesConsultaDono = {
  metricas: (unidadeId: string, periodo: string) =>
    ["dono", "metricas", unidadeId, periodo] as const,
  receita: (unidadeId: string, granularidade: string) =>
    ["dono", "receita", unidadeId, granularidade] as const,
  ranking: (unidadeId: string, periodo: string) =>
    ["dono", "ranking", unidadeId, periodo] as const,
};
