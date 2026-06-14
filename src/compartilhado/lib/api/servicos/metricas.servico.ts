import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type {
  MetricasVisaoGeral,
  SerieFaturamento,
  RankingBarbeiro,
  Unidade,
} from "@/compartilhado/tipos/entidades";

export async function obterMetricasVisaoGeral(params: {
  unit_id: string;
  period: string;
}) {
  return clienteApi.get<MetricasVisaoGeral>("/metrics/overview", { params });
}

export async function obterSerieFaturamento(params: {
  unit_id: string;
  granularity: "day" | "week" | "month";
}) {
  return clienteApi.get<SerieFaturamento[]>("/metrics/revenue-series", {
    params,
  });
}

export async function obterRankingBarbeiros(params: {
  unit_id: string;
  period: string;
}) {
  return clienteApi.get<RankingBarbeiro[]>("/metrics/barber-ranking", {
    params,
  });
}

export async function compararUnidades(period: string) {
  return clienteApi.get<Unidade[]>("/metrics/units-compare", {
    params: { period },
  });
}
