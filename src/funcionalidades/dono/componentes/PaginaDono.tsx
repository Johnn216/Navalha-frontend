"use client";

import { useState } from "react";
import { LayoutApp } from "@/compartilhado/layouts/LayoutApp";
import { SeloKpi } from "@/compartilhado/componentes/ui/SeloKpi";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { formatarBRL, formatarBRLCompacto } from "@/compartilhado/lib/formatadores/moeda";
import { useQuery } from "@tanstack/react-query";
import {
  obterMetricasVisaoGeral,
  obterSerieFaturamento,
  obterRankingBarbeiros,
} from "@/compartilhado/lib/api/servicos/metricas.servico";
import { UNIT_CENTRO_ID } from "@/compartilhado/mocks/dados-sementes";
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chavesConsultaDono } from "@/funcionalidades/dono/chaves-consulta";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";

const NAV = [
  { href: "/dono", rotulo: "Visão geral" },
  { href: "/dono/financeiro", rotulo: "Financeiro" },
  { href: "/dono/equipe", rotulo: "Equipe" },
  { href: "/dono/comissao", rotulo: "Comissão" },
];

export function PaginaDono({ segmento = "visao" }: { segmento?: string }) {
  const { unidadeId } = useUnidadeAtiva();
  const unit = unidadeId || UNIT_CENTRO_ID;
  const [periodo, setPeriodo] = useState<"day" | "week" | "month">("month");

  const metricas = useQuery({
    queryKey: chavesConsultaDono.metricas(unit, periodo),
    queryFn: () => obterMetricasVisaoGeral({ unit_id: unit, period: periodo }),
  });
  const serie = useQuery({
    queryKey: chavesConsultaDono.receita(unit, periodo),
    queryFn: () => obterSerieFaturamento({ unit_id: unit, granularity: periodo as "day" | "week" | "month" }),
  });
  const ranking = useQuery({
    queryKey: chavesConsultaDono.ranking(unit, "2026-10"),
    queryFn: () => obterRankingBarbeiros({ unit_id: unit, period: "2026-10" }),
  });

  if (metricas.isLoading) return <EstadoCarregando />;

  const chartData =
    serie.data?.map((s) => ({
      name: s.label,
      valor: s.value_cents / 100,
    })) ?? [];

  return (
    <LayoutApp itensNav={NAV} titulo="Dono · Navalha Centro">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">Visão geral</p>
          <h2 className="font-serif text-3xl">
            Visão <span className="italic text-accent">geral</span>
          </h2>
        </div>
        <div className="flex gap-2">
          {(["day", "week", "month"] as const).map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={periodo === g}
              onClick={() => setPeriodo(g)}
              className={`min-h-[44px] rounded-sm px-3 text-xs uppercase ${periodo === g ? "bg-accent text-accent-ink" : "border border-rule"}`}
            >
              {g === "day" ? "Diário" : g === "week" ? "Semanal" : "Mensal"}
            </button>
          ))}
        </div>
      </div>

      {(segmento === "visao" || segmento === "financeiro") && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SeloKpi
              rotulo="Receita do mês"
              valor={formatarBRLCompacto(metricas.data?.revenue_cents ?? 0)}
              delta={`+${metricas.data?.revenue_delta_pct ?? 0}% vs mês anterior`}
              deltaPositivo
            />
            <SeloKpi rotulo="Ocupação" valor={`${metricas.data?.occupancy_pct ?? 0}%`} />
            <SeloKpi rotulo="Ticket médio" valor={formatarBRL(metricas.data?.avg_ticket_cents ?? 0)} />
            <SeloKpi rotulo="No-show" valor={`${metricas.data?.no_show_pct ?? 0}%`} />
          </div>

          <Cartao titulo="Faturamento" className="mb-8">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="var(--ink-mute)" fontSize={11} />
                  <YAxis stroke="var(--ink-mute)" fontSize={11} tickFormatter={(v) => `R$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--rule)" }}
                    formatter={(v) => [
                      `R$ ${Number(v ?? 0).toLocaleString("pt-BR")}`,
                      "Faturamento",
                    ]}
                  />
                  <Bar dataKey="valor" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Cartao>
        </>
      )}

      {(segmento === "visao" || segmento === "equipe") && (
        <Cartao titulo="Ranking de barbeiros">
          {ranking.data?.map((b, i) => (
            <div key={b.barber_id} className="flex items-center justify-between border-b border-rule py-3">
              <div className="flex items-center gap-3">
                <span className="font-serif text-xl text-accent">{i + 1}★</span>
                <div>
                  <p>{b.display_name}</p>
                  <p className="text-sm text-ink-mute">
                    {formatarBRLCompacto(b.revenue_cents)} · {b.cuts} cortes · {b.occupancy_pct}%
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm text-ok">+{b.delta_pct}%</span>
            </div>
          ))}
        </Cartao>
      )}

      {segmento === "comissao" && (
        <Cartao titulo="Regras de comissão">
          <p className="text-ink-soft">40% global · ver módulo comissão para detalhes</p>
        </Cartao>
      )}
    </LayoutApp>
  );
}
