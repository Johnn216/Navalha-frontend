"use client";

import { LayoutMobile } from "@/compartilhado/layouts/LayoutMobile";
import { SeloKpi } from "@/compartilhado/componentes/ui/SeloKpi";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { Selo } from "@/compartilhado/componentes/ui/Selo";
import { formatarBRL } from "@/compartilhado/lib/formatadores/moeda";
import { formatarHora } from "@/compartilhado/lib/formatadores/data-hora";
import { useQuery } from "@tanstack/react-query";
import { listarAgendamentos } from "@/compartilhado/lib/api/servicos/agendamentos.servico";
import { listarLancamentosComissao } from "@/compartilhado/lib/api/servicos/comissao.servico";
import { listarPortfolio } from "@/compartilhado/lib/api/servicos/portfolio.servico";
import { UNIT_CENTRO_ID } from "@/compartilhado/mocks/dados-sementes";
import { Calendar, Users, Wallet, Camera, Scissors } from "lucide-react";

const ABAS = [
  { href: "/barbeiro", rotulo: "Hoje", icone: Scissors },
  { href: "/barbeiro/agenda", rotulo: "Agenda", icone: Calendar },
  { href: "/barbeiro/clientes", rotulo: "Clientes", icone: Users },
  { href: "/barbeiro/carteira", rotulo: "Carteira", icone: Wallet },
  { href: "/barbeiro/studio", rotulo: "Studio", icone: Camera },
];

export function PaginaBarbeiro({ segmento = "hoje" }: { segmento?: string }) {
  const hoje = new Date().toISOString().split("T")[0];
  const agendamentos = useQuery({
    queryKey: ["barbeiro", "agenda", hoje],
    queryFn: () =>
      listarAgendamentos({ unit_id: UNIT_CENTRO_ID, date: hoje, barber_id: "barber-rafael" }),
  });
  const comissao = useQuery({
    queryKey: ["barbeiro", "comissao"],
    queryFn: () =>
      listarLancamentosComissao({ barber_id: "barber-rafael", period: "2026-06" }),
  });
  const portfolio = useQuery({
    queryKey: ["barbeiro", "portfolio"],
    queryFn: () => listarPortfolio("barber-rafael"),
  });

  const totalComissao =
    comissao.data?.data.reduce((s, l) => s + l.amount_cents, 0) ?? 38400;

  return (
    <LayoutMobile abas={ABAS} titulo="Olá, Rafael">
      {segmento === "hoje" && (
        <>
          <div className="mb-6 grid grid-cols-3 gap-2">
            <SeloKpi rotulo="Cortes" valor="8" />
            <SeloKpi rotulo="Comissão" valor={formatarBRL(totalComissao)} />
            <SeloKpi rotulo="Próximos" valor="2" />
          </div>
          <Cartao titulo="Agenda de hoje">
            {agendamentos.data?.data.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-rule py-3">
                <div>
                  <span className="font-mono tabular-nums">{formatarHora(a.starts_at)}</span>
                  <p className="font-medium">{a.client?.name}</p>
                  <p className="text-sm text-ink-mute">{a.client?.total_visits === 1 ? "1ª vez" : `Regular há ${a.client?.total_visits}m`}</p>
                </div>
                <Selo variante={a.status === "IN_SERVICE" ? "ok" : a.status === "PAID" ? "accent" : "padrao"}>
                  {a.status === "IN_SERVICE" ? "Agora" : a.status === "PAID" ? "Pago" : "Confirmado"}
                </Selo>
              </div>
            ))}
          </Cartao>
        </>
      )}

      {segmento === "agenda" && (
        <Cartao titulo="Minha agenda">
          <p className="text-ink-soft">Visão semanal — bloqueie férias, almoço ou reunião.</p>
          <div className="mt-4 space-y-2">
            <button type="button" className="w-full rounded-sm border border-rule p-3 text-left">+ Bloquear horário</button>
          </div>
        </Cartao>
      )}

      {segmento === "clientes" && (
        <Cartao titulo="Meus clientes">
          {agendamentos.data?.data.map((a) => (
            <div key={a.id} className="py-3">
              <p>{a.client?.name}</p>
              <p className="text-sm text-ink-mute">{a.client?.notes ?? "Sem preferências registradas"}</p>
            </div>
          ))}
        </Cartao>
      )}

      {segmento === "carteira" && (
        <Cartao titulo="Carteira">
          <p className="font-serif text-4xl text-accent">{formatarBRL(totalComissao)}</p>
          <p className="text-sm text-ink-mute">Comissão acumulada · Junho 2026</p>
          {comissao.data?.data.map((l) => (
            <div key={l.id} className="mt-3 flex justify-between border-t border-rule pt-3">
              <span>Atendimento</span>
              <span className="font-mono">{formatarBRL(l.amount_cents)}</span>
            </div>
          ))}
        </Cartao>
      )}

      {segmento === "studio" && (
        <Cartao titulo="Studio · Portfólio">
          {portfolio.data?.map((p) => (
            <div key={p.id} className="mb-4 rounded-sm border border-rule p-3">
              <div className="mb-2 h-32 rounded-sm bg-bg-soft" />
              <p>{p.caption}</p>
              <p className="text-sm text-ink-mute">❤ {p.likes}</p>
            </div>
          ))}
          <button type="button" className="w-full rounded-sm border border-dashed border-accent p-4 text-accent">
            + Publicar corte
          </button>
        </Cartao>
      )}
    </LayoutMobile>
  );
}
