"use client";

import { useState } from "react";
import { LayoutApp } from "@/compartilhado/layouts/LayoutApp";
import { SeloKpi } from "@/compartilhado/componentes/ui/SeloKpi";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { formatarBRL, formatarBRLCompacto } from "@/compartilhado/lib/formatadores/moeda";
import { useQuery } from "@tanstack/react-query";
import {
  obterMetricasVisaoGeral,
  obterSerieFaturamento,
  obterRankingBarbeiros,
} from "@/compartilhado/lib/api/servicos/metricas.servico";
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { chavesConsultaDono } from "@/funcionalidades/dono/chaves-consulta";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import {
  metricasVisaoGeral as mockMetricas,
  serieFaturamento as mockSerie,
  rankingBarbeiros as mockRanking,
} from "@/compartilhado/mocks/dados-sementes";
import { TrendingUp, Users, Calendar, AlertTriangle, Plus, Mail, Phone } from "lucide-react";

const NAV = [
  { href: "/dono", rotulo: "Visão geral" },
  { href: "/dono/financeiro", rotulo: "Financeiro" },
  { href: "/dono/equipe", rotulo: "Equipe" },
  { href: "/dono/comissao", rotulo: "Comissão" },
];

const PERIODOS = [
  { key: "day" as const, rotulo: "Diário" },
  { key: "week" as const, rotulo: "Semanal" },
  { key: "month" as const, rotulo: "Mensal" },
];

export function PaginaDono({ segmento = "visao" }: { segmento?: string }) {
  const { unidadeId } = useUnidadeAtiva();
  const [periodo, setPeriodo] = useState<"day" | "week" | "month">("month");

  const metricas = useQuery({
    queryKey: chavesConsultaDono.metricas(unidadeId, periodo),
    queryFn: () => obterMetricasVisaoGeral({ unit_id: unidadeId, period: periodo }),
    enabled: !!unidadeId,
    retry: 1,
  });
  const serie = useQuery({
    queryKey: chavesConsultaDono.receita(unidadeId, periodo),
    queryFn: () => obterSerieFaturamento({ unit_id: unidadeId, granularity: periodo }),
    enabled: !!unidadeId,
    retry: 1,
  });
  const ranking = useQuery({
    queryKey: chavesConsultaDono.ranking(unidadeId, "2026-10"),
    queryFn: () => obterRankingBarbeiros({ unit_id: unidadeId, period: "2026-10" }),
    enabled: !!unidadeId,
    retry: 1,
  });

  if (!unidadeId) return <EstadoCarregando />;
  if (metricas.isLoading) return <EstadoCarregando />;

  // Fallback para dados mock quando API falha — garante demo sempre funcional
  const dadosMetricas = metricas.data ?? mockMetricas;
  const dadosSerie = serie.data ?? mockSerie;
  const dadosRanking = ranking.data ?? mockRanking;
  const usandoMock = metricas.isError;

  const chartData = dadosSerie.map((s, idx) => ({
    name: s.label,
    valor: s.value_cents / 100,
    destaque: idx === dadosSerie.length - 1,
  }));

  const maxRanking = dadosRanking[0]?.revenue_cents ?? 1;

  return (
    <LayoutApp itensNav={NAV} titulo="Dono · Navalha Centro">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
            {usandoMock ? "Demo · dados de exemplo" : "Dados em tempo real"}
          </p>
          <h2 className="font-serif text-3xl">
            Visão <span className="italic text-accent">geral</span>
          </h2>
        </div>
        <div className="flex gap-2">
          {PERIODOS.map(({ key, rotulo }) => (
            <button
              key={key}
              type="button"
              aria-pressed={periodo === key}
              onClick={() => setPeriodo(key)}
              className={`min-h-[44px] rounded-sm px-3 text-xs uppercase tracking-wider transition-all ${
                periodo === key
                  ? "bg-accent text-accent-ink shadow-[0_2px_8px_color-mix(in_oklab,var(--accent)_30%,transparent)]"
                  : "border border-rule text-ink-soft hover:border-accent/40 hover:text-ink"
              }`}
            >
              {rotulo}
            </button>
          ))}
        </div>
      </div>

      {(segmento === "visao" || segmento === "financeiro") && (
        <>
          {/* KPI Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SeloKpi
              rotulo="Receita do mês"
              valor={formatarBRLCompacto(dadosMetricas.revenue_cents)}
              delta={`+${dadosMetricas.revenue_delta_pct}% vs mês anterior`}
              deltaPositivo
            />
            <SeloKpi
              rotulo="Ocupação"
              valor={`${dadosMetricas.occupancy_pct}%`}
            />
            <SeloKpi
              rotulo="Ticket médio"
              valor={formatarBRL(dadosMetricas.avg_ticket_cents)}
            />
            <SeloKpi
              rotulo="Taxa no-show"
              valor={`${dadosMetricas.no_show_pct}%`}
              delta="vs 12% sem IA"
              deltaPositivo
            />
          </div>

          {/* Gráfico de Faturamento */}
          <Cartao
            titulo="Faturamento mensal"
            className="mb-8"
            acoes={
              <div className="flex items-center gap-1.5 font-mono text-xs text-ok">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+{dadosMetricas.revenue_delta_pct}% este mês</span>
              </div>
            }
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="30%">
                  <XAxis
                    dataKey="name"
                    stroke="var(--ink-mute)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--ink-mute)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `R$${v / 1000}k`}
                    width={55}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--bg-elev)" }}
                    contentStyle={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--rule)",
                      borderRadius: "6px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                    }}
                    formatter={(v) => [
                      `R$ ${Number(v ?? 0).toLocaleString("pt-BR")}`,
                      "Faturamento",
                    ]}
                  />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.destaque
                            ? "var(--accent)"
                            : "color-mix(in oklab, var(--accent) 40%, var(--bg-elev))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Cartao>
        </>
      )}

      {segmento === "visao" && (
        <Cartao
          titulo="Ranking de barbeiros"
          acoes={
            <div className="flex items-center gap-1.5 font-mono text-xs text-ink-mute">
              <Calendar className="h-3.5 w-3.5" />
              <span>Outubro 2026</span>
            </div>
          }
        >
          <div className="space-y-1">
            {dadosRanking.map((b, i) => {
              const pct = Math.round((b.revenue_cents / maxRanking) * 100);
              return (
                <div
                  key={b.barber_id}
                  className="group rounded-sm p-3 transition-colors hover:bg-bg-soft"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Posição + Avatar placeholder */}
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-elev border border-rule font-serif text-accent">
                          {b.display_name.charAt(0)}
                        </div>
                        <span className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full font-mono text-[9px] font-bold ${i === 0 ? "bg-accent text-accent-ink" : "bg-bg-card text-ink-mute border border-rule"}`}>
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-ink">{b.display_name}</p>
                        <p className="font-mono text-xs text-ink-mute">
                          {b.cuts} cortes · {b.occupancy_pct}% ocupação
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg text-ink">
                        {formatarBRLCompacto(b.revenue_cents)}
                      </p>
                      <p className="font-mono text-xs text-ok">+{b.delta_pct}%</p>
                    </div>
                  </div>
                  {/* Barra de progresso */}
                  <div className="mt-2 h-1.5 rounded-full bg-bg-elev overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Cartao>
      )}

      {segmento === "equipe" && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-2xl text-ink">Gerenciar Equipe</h3>
            <Botao className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar profissional
            </Botao>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <Cartao titulo="Profissionais ativos">
              <div className="space-y-4">
                {dadosRanking.map((b) => (
                  <div key={b.barber_id} className="flex items-center justify-between rounded-sm border border-rule bg-bg-soft p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-elev border border-rule font-serif text-xl text-accent">
                        {b.display_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{b.display_name}</p>
                        <div className="mt-1 flex items-center gap-3 font-mono text-xs text-ink-mute">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {b.display_name.split(' ')[0].toLowerCase()}@navalha.com</span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> (11) 99999-0000</span>
                        </div>
                      </div>
                    </div>
                    <Botao variante="secundario" tamanho="sm">Editar</Botao>
                  </div>
                ))}
              </div>
            </Cartao>

            <Cartao
              titulo="Ranking do mês"
              acoes={
                <div className="flex items-center gap-1.5 font-mono text-xs text-ink-mute">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Outubro 2026</span>
                </div>
              }
            >
              <div className="space-y-1">
                {dadosRanking.map((b, i) => {
                  const pct = Math.round((b.revenue_cents / maxRanking) * 100);
                  return (
                    <div
                      key={b.barber_id}
                      className="group rounded-sm p-3 transition-colors hover:bg-bg-soft"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-elev border border-rule font-serif text-accent">
                              {b.display_name.charAt(0)}
                            </div>
                            <span className={`absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full font-mono text-[8px] font-bold ${i === 0 ? "bg-accent text-accent-ink" : "bg-bg-card text-ink-mute border border-rule"}`}>
                              {i + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ink">{b.display_name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-ink">
                            {formatarBRLCompacto(b.revenue_cents)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-bg-elev overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Cartao>
          </div>
        </>
      )}

      {segmento === "comissao" && (
        <Cartao titulo="Regras de comissão">
          <div className="flex items-start gap-3 rounded-sm border border-accent/30 bg-accent/5 p-4 text-sm">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="font-medium text-ink">40% global para todos os barbeiros</p>
              <p className="mt-1 text-ink-mute">
                Regra aplicada automaticamente a cada atendimento. Acesse{" "}
                <a href="/dono/comissao" className="text-accent underline">
                  módulo comissão
                </a>{" "}
                para detalhes e exportação.
              </p>
            </div>
          </div>
        </Cartao>
      )}
    </LayoutApp>
  );
}
