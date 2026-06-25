"use client";

import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { SeloKpi } from "@/compartilhado/componentes/ui/SeloKpi";
import { formatarBRL, formatarBRLCompacto } from "@/compartilhado/lib/formatadores/moeda";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  listarRegrasComissao,
  listarLancamentosComissao,
  exportarComissao,
} from "@/compartilhado/lib/api/servicos/comissao.servico";
import { listarBarbeiros } from "@/compartilhado/lib/api/servicos/barbeiros.servico";
import { LayoutApp } from "@/compartilhado/layouts/LayoutApp";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";
import {
  regrasComissao as mockRegras,
  lancamentosComissao as mockLancamentos,
  rankingBarbeiros as mockRanking,
  barbeiros as mockBarbeiros,
} from "@/compartilhado/mocks/dados-sementes";
import { Download, Percent, Users, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const NAV = [
  { href: "/dono/comissao", rotulo: "Comissão" },
  { href: "/dono", rotulo: "← Visão geral" },
];

const PERIODO_ATUAL = "2026-06";

export function PaginaComissao() {
  const { unidadeId } = useUnidadeAtiva();

  const barbeiros = useQuery({
    queryKey: ["comissao", "barbeiros", unidadeId],
    queryFn: () => listarBarbeiros(unidadeId),
    enabled: !!unidadeId,
    retry: 1,
  });

  const barbeiroId = (barbeiros.data ?? mockBarbeiros)[0]?.id;

  const regras = useQuery({
    queryKey: ["comissao", "regras"],
    queryFn: listarRegrasComissao,
    retry: 1,
  });
  const lancamentos = useQuery({
    queryKey: ["comissao", "lancamentos", barbeiroId],
    queryFn: () =>
      listarLancamentosComissao({ barber_id: barbeiroId!, period: PERIODO_ATUAL }),
    enabled: !!barbeiroId,
    retry: 1,
  });
  const exportar = useMutation({ mutationFn: exportarComissao });

  if (barbeiros.isLoading || regras.isLoading || lancamentos.isLoading) {
    return <EstadoCarregando />;
  }

  // Fallback para dados mock — garante que a página sempre funcione
  const dadosBarbeiros = barbeiros.data ?? mockBarbeiros;
  const dadosRegras = regras.data ?? mockRegras;
  const dadosLancamentos = lancamentos.data?.data ?? mockLancamentos;

  const nomeBarbeiro = dadosBarbeiros[0]?.display_name ?? "Barbeiro";
  const totalComissao = dadosLancamentos.reduce((s, l) => s + l.amount_cents, 0);
  const totalBase = dadosLancamentos.reduce((s, l) => s + l.base_cents, 0);
  const percentualMedio =
    dadosLancamentos.length > 0
      ? Math.round(dadosLancamentos.reduce((s, l) => s + (l.amount_cents / l.base_cents) * 100, 0) / dadosLancamentos.length)
      : 40;

  // Dados para o gráfico de pizza (distribuição por barbeiro usando ranking mock)
  const dadosPie = mockRanking.map((b, idx) => ({
    name: b.display_name,
    value: b.revenue_cents,
    color: idx === 0 ? "var(--accent)" : "color-mix(in oklab, var(--accent) 45%, var(--bg-elev))",
  }));

  return (
    <LayoutApp itensNav={NAV} titulo="Comissão">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
          Módulo de comissão
        </p>
        <h2 className="font-serif text-3xl">
          Comissão <span className="italic text-accent">automática</span>
        </h2>
      </div>

      {/* KPI Cards de resumo */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <SeloKpi
          rotulo="Pago este mês"
          valor={formatarBRLCompacto(totalComissao)}
          delta="acumulado no período"
          deltaPositivo
        />
        <SeloKpi
          rotulo="Percentual médio"
          valor={`${percentualMedio}%`}
        />
        <SeloKpi
          rotulo="Faturamento bruto"
          valor={formatarBRLCompacto(totalBase)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Regras ativas */}
        <Cartao
          titulo="Regras ativas"
          acoes={
            <div className="flex items-center gap-1 font-mono text-xs text-accent">
              <Percent className="h-3.5 w-3.5" />
              <span>Auto-aplicadas</span>
            </div>
          }
        >
          {dadosRegras.length > 0 ? (
            <div className="space-y-2">
              {dadosRegras.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-sm border border-rule bg-bg-soft p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                      <Percent className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize text-ink">
                        {r.scope === "GLOBAL" ? "Global · Todos os barbeiros" : r.scope}
                      </p>
                      <p className="font-mono text-xs text-ink-mute">
                        Tipo: {r.type === "PERCENT" ? "Percentual" : "Tabela"} · Prioridade {r.priority}
                      </p>
                    </div>
                  </div>
                  <span className="font-serif text-2xl text-accent">
                    {typeof r.value === "number" ? `${r.value}%` : "Tabela"}
                  </span>
                </div>
              ))}
              <p className="pt-2 font-mono text-[11px] text-ink-mute">
                Regras aplicadas automaticamente no fechamento de cada atendimento.
              </p>
            </div>
          ) : (
            <p className="text-ink-soft">Nenhuma regra cadastrada.</p>
          )}
        </Cartao>

        {/* Distribuição por barbeiro */}
        <Cartao
          titulo="Distribuição por barbeiro"
          acoes={
            <div className="flex items-center gap-1 font-mono text-xs text-ink-mute">
              <Users className="h-3.5 w-3.5" />
              <span>Outubro 2026</span>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dadosPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--rule)",
                      borderRadius: "6px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                    }}
                    formatter={(v) => [
                      `R$ ${Number(v).toLocaleString("pt-BR")}`,
                      "Receita",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {dadosPie.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: entry.color }}
                    />
                    <span className="text-sm text-ink-soft">{entry.name}</span>
                  </div>
                  <span className="font-mono text-sm text-ink">
                    {formatarBRLCompacto(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Cartao>
      </div>

      {/* Lançamentos */}
      <Cartao
        titulo={`Lançamentos · ${nomeBarbeiro}`}
        className="mt-6"
        acoes={
          <div className="flex items-center gap-1 font-mono text-xs text-ok">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{PERIODO_ATUAL}</span>
          </div>
        }
      >
        {dadosLancamentos.length > 0 ? (
          <>
            <div className="divide-y divide-rule">
              {dadosLancamentos.map((l) => (
                <div key={l.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">Atendimento · {l.period}</p>
                    <p className="font-mono text-xs text-ink-mute">
                      Base: {formatarBRL(l.base_cents)} · Status:{" "}
                      <span className={l.status === "PAID" ? "text-ok" : "text-warn"}>
                        {l.status === "PAID" ? "Pago" : l.status === "ACCRUED" ? "Acumulado" : l.status}
                      </span>
                    </p>
                  </div>
                  <span className="font-serif text-xl text-accent">
                    {formatarBRL(l.amount_cents)}
                  </span>
                </div>
              ))}
            </div>
            {barbeiroId && (
              <div className="mt-4 border-t border-rule pt-4">
                <Botao
                  variante="secundario"
                  className="flex items-center gap-2"
                  onClick={() =>
                    exportar.mutate({ barber_id: barbeiroId, period: PERIODO_ATUAL })
                  }
                >
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Botao>
              </div>
            )}
          </>
        ) : (
          <p className="text-ink-soft">Sem lançamentos neste período.</p>
        )}
      </Cartao>
    </LayoutApp>
  );
}
