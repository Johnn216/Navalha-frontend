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
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";
import { useSessao } from "@/funcionalidades/autenticacao/hooks/useSessao";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import { EstadoVazio } from "@/compartilhado/componentes/feedback/EstadoVazio";
import { Calendar, Users, Wallet, Camera, Scissors } from "lucide-react";

const ABAS = [
  { href: "/barbeiro", rotulo: "Hoje", icone: Scissors },
  { href: "/barbeiro/agenda", rotulo: "Agenda", icone: Calendar },
  { href: "/barbeiro/clientes", rotulo: "Clientes", icone: Users },
  { href: "/barbeiro/carteira", rotulo: "Carteira", icone: Wallet },
  { href: "/barbeiro/studio", rotulo: "Studio", icone: Camera },
];

const PERIODO_ATUAL = "2026-06";

export function PaginaBarbeiro({ segmento = "hoje" }: { segmento?: string }) {
  const { unidadeId } = useUnidadeAtiva();
  const { usuario } = useSessao();
  const barbeiroId = usuario?.id ?? "";
  const hoje = new Date().toISOString().split("T")[0];

  const agendamentos = useQuery({
    queryKey: ["barbeiro", "agenda", hoje, unidadeId, barbeiroId],
    queryFn: () =>
      listarAgendamentos({ unit_id: unidadeId, date: hoje, barber_id: barbeiroId }),
    enabled: !!unidadeId && !!barbeiroId,
  });
  const comissao = useQuery({
    queryKey: ["barbeiro", "comissao", barbeiroId],
    queryFn: () =>
      listarLancamentosComissao({ barber_id: barbeiroId, period: PERIODO_ATUAL }),
    enabled: !!barbeiroId,
  });
  const portfolio = useQuery({
    queryKey: ["barbeiro", "portfolio", barbeiroId],
    queryFn: () => listarPortfolio(barbeiroId),
    enabled: !!barbeiroId,
  });

  const totalComissao =
    comissao.data?.data?.reduce((s, l) => s + l.amount_cents, 0) ?? 0;

  const titulo = usuario?.name ? `Olá, ${usuario.name.split(" ")[0]}` : "Olá";

  if (!unidadeId || !barbeiroId) return <EstadoCarregando />;

  if (segmento === "studio" && portfolio.isLoading) return <EstadoCarregando />;
  if (segmento === "studio" && portfolio.isError) {
    return (
      <LayoutMobile abas={ABAS} titulo={titulo}>
        <EstadoVazio
          titulo="Studio em breve"
          descricao="O portfólio estará disponível quando o backend implementar esta funcionalidade."
        />
      </LayoutMobile>
    );
  }

  if ((segmento === "hoje" || segmento === "clientes") && agendamentos.isLoading) {
    return <EstadoCarregando />;
  }
  if ((segmento === "hoje" || segmento === "clientes") && agendamentos.isError) {
    return (
      <LayoutMobile abas={ABAS} titulo={titulo}>
        <EstadoVazio titulo="Agenda indisponível" descricao="Não foi possível carregar os agendamentos." />
      </LayoutMobile>
    );
  }

  return (
    <LayoutMobile abas={ABAS} titulo={titulo}>
      {segmento === "hoje" && (
        <>
          <div className="mb-6 grid grid-cols-3 gap-2">
            <SeloKpi rotulo="Cortes" valor={String(agendamentos.data?.data?.length ?? 0)} />
            <SeloKpi rotulo="Comissão" valor={formatarBRL(totalComissao)} />
            <SeloKpi rotulo="Próximos" valor="—" />
          </div>
          <Cartao titulo="Agenda de hoje">
            {agendamentos.data?.data?.length ? (
              agendamentos.data.data.map((a) => (
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
              ))
            ) : (
              <p className="text-ink-soft">Nenhum agendamento para hoje.</p>
            )}
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
          {agendamentos.data?.data?.length ? (
            agendamentos.data.data.map((a) => (
              <div key={a.id} className="py-3">
                <p>{a.client?.name}</p>
                <p className="text-sm text-ink-mute">{a.client?.notes ?? "Sem preferências registradas"}</p>
              </div>
            ))
          ) : (
            <p className="text-ink-soft">Sem clientes agendados.</p>
          )}
        </Cartao>
      )}

      {segmento === "carteira" && (
        <Cartao titulo="Carteira">
          {comissao.isError ? (
            <EstadoVazio titulo="Comissão em breve" descricao="Dados de comissão indisponíveis no momento." />
          ) : (
            <>
              <p className="font-serif text-4xl text-accent">{formatarBRL(totalComissao)}</p>
              <p className="text-sm text-ink-mute">Comissão acumulada · {PERIODO_ATUAL}</p>
              {comissao.data?.data?.map((l) => (
                <div key={l.id} className="mt-3 flex justify-between border-t border-rule pt-3">
                  <span>Atendimento</span>
                  <span className="font-mono">{formatarBRL(l.amount_cents)}</span>
                </div>
              ))}
            </>
          )}
        </Cartao>
      )}

      {segmento === "studio" && (
        <Cartao titulo="Studio · Portfólio">
          {portfolio.data?.length ? (
            portfolio.data.map((p) => (
              <div key={p.id} className="mb-4 rounded-sm border border-rule p-3">
                <div className="mb-2 h-32 rounded-sm bg-bg-soft" />
                <p>{p.caption}</p>
                <p className="text-sm text-ink-mute">❤ {p.likes}</p>
              </div>
            ))
          ) : (
            <p className="text-ink-soft">Nenhuma publicação no portfólio.</p>
          )}
          <button type="button" className="mt-4 w-full rounded-sm border border-dashed border-accent p-4 text-accent">
            + Publicar corte
          </button>
        </Cartao>
      )}
    </LayoutMobile>
  );
}
