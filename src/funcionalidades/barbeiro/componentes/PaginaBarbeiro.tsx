"use client";

import { LayoutMobile } from "@/compartilhado/layouts/LayoutMobile";
import { SeloKpi } from "@/compartilhado/componentes/ui/SeloKpi";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { Selo } from "@/compartilhado/componentes/ui/Selo";
import { formatarBRL } from "@/compartilhado/lib/formatadores/moeda";
import { formatarHora } from "@/compartilhado/lib/formatadores/data-hora";
import { formatInTimeZone } from "date-fns-tz";
import { FUSO_HORARIO_PADRAO } from "@/compartilhado/lib/constantes";
import { useQuery } from "@tanstack/react-query";
import { listarPortfolio } from "@/compartilhado/lib/api/servicos/portfolio.servico";
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";
import { useSessao } from "@/funcionalidades/autenticacao/hooks/useSessao";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import { EstadoVazio } from "@/compartilhado/componentes/feedback/EstadoVazio";
import { chavesConsultaBarbeiro } from "@/funcionalidades/barbeiro/chaves-consulta";
import {
  calcularComissaoFallback,
  obterProximoAgendamento,
  useAgendamentosDoBarbeiro,
  useBarbeiroAtual,
  useComissaoBarbeiro,
} from "@/funcionalidades/barbeiro/hooks/useBarbeiro";
import type { Agendamento } from "@/compartilhado/tipos/entidades";
import { Calendar, Users, Wallet, Camera, Scissors } from "lucide-react";

const ABAS = [
  { href: "/barbeiro", rotulo: "Hoje", icone: Scissors },
  { href: "/barbeiro/agenda", rotulo: "Agenda", icone: Calendar },
  { href: "/barbeiro/clientes", rotulo: "Clientes", icone: Users },
  { href: "/barbeiro/carteira", rotulo: "Carteira", icone: Wallet },
  { href: "/barbeiro/studio", rotulo: "Studio", icone: Camera },
];

function rotuloStatus(status: Agendamento["status"]): string {
  switch (status) {
    case "IN_SERVICE":
      return "Agora";
    case "PAID":
      return "Pago";
    case "PENDING":
      return "Pendente";
    case "CONFIRMED":
      return "Confirmado";
    default:
      return status;
  }
}

function varianteStatus(status: Agendamento["status"]) {
  if (status === "IN_SERVICE") return "ok" as const;
  if (status === "PAID") return "accent" as const;
  return "padrao" as const;
}

export function PaginaBarbeiro({ segmento = "hoje" }: { segmento?: string }) {
  const { unidadeId } = useUnidadeAtiva();
  const { usuario } = useSessao();
  const userId = usuario?.id ?? "";
  const hoje = formatInTimeZone(new Date(), FUSO_HORARIO_PADRAO, "yyyy-MM-dd");
  const periodoAtual = formatInTimeZone(new Date(), FUSO_HORARIO_PADRAO, "yyyy-MM");

  const barbeiroAtual = useBarbeiroAtual(unidadeId, userId);
  const barbeiroId = barbeiroAtual.data?.id ?? "";

  const agendamentos = useAgendamentosDoBarbeiro(unidadeId, barbeiroId, hoje);
  const comissao = useComissaoBarbeiro(barbeiroId, periodoAtual);
  const portfolio = useQuery({
    queryKey: chavesConsultaBarbeiro.portfolio(barbeiroId),
    queryFn: () => listarPortfolio(barbeiroId),
    enabled: !!barbeiroId,
    retry: false,
  });

  const listaAgendamentos = agendamentos.data?.data ?? [];
  const lancamentos = comissao.data?.data ?? [];
  const totalComissaoApi = lancamentos.reduce((s, l) => s + l.amount_cents, 0);
  const usarFallbackComissao =
    comissao.isError || (!comissao.isLoading && lancamentos.length === 0);
  const totalComissao = usarFallbackComissao
    ? calcularComissaoFallback(listaAgendamentos, barbeiroId, periodoAtual)
    : totalComissaoApi;

  const proximo = obterProximoAgendamento(listaAgendamentos);
  const valorProximo = proximo
    ? `${formatarHora(proximo.starts_at)} · ${proximo.client?.name?.split(" ")[0] ?? "Cliente"}`
    : "—";

  const titulo = usuario?.name ? `Olá, ${usuario.name.split(" ")[0]}` : "Olá";

  if (!unidadeId || !userId || barbeiroAtual.isLoading) {
    return <EstadoCarregando />;
  }

  if (barbeiroAtual.isError || !barbeiroId) {
    return (
      <LayoutMobile abas={ABAS} titulo={titulo}>
        <EstadoVazio
          titulo="Perfil indisponível"
          descricao="Não foi possível carregar o perfil de barbeiro."
        />
      </LayoutMobile>
    );
  }

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
        <EstadoVazio
          titulo="Agenda indisponível"
          descricao="Não foi possível carregar os agendamentos."
        />
      </LayoutMobile>
    );
  }

  return (
    <LayoutMobile abas={ABAS} titulo={titulo}>
      {segmento === "hoje" && (
        <>
          <div className="mb-6 grid grid-cols-3 gap-2">
            <SeloKpi rotulo="Cortes" valor={String(listaAgendamentos.length)} />
            <SeloKpi rotulo="Comissão" valor={formatarBRL(totalComissao)} />
            <SeloKpi rotulo="Próximo" valor={valorProximo} />
          </div>
          <Cartao titulo="Agenda de hoje">
            {listaAgendamentos.length ? (
              listaAgendamentos.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between border-b border-rule py-3"
                >
                  <div>
                    <span className="font-mono tabular-nums">
                      {formatarHora(a.starts_at)}
                    </span>
                    <p className="font-medium">{a.client?.name}</p>
                    <p className="text-sm text-ink-mute">
                      {a.client?.total_visits === 1
                        ? "1ª vez"
                        : `Regular há ${a.client?.total_visits}m`}
                    </p>
                  </div>
                  <Selo variante={varianteStatus(a.status)}>
                    {rotuloStatus(a.status)}
                  </Selo>
                </div>
              ))
            ) : (
              <EstadoVazio
                titulo="Dia livre"
                descricao="Nenhum agendamento para hoje."
              />
            )}
          </Cartao>
        </>
      )}

      {segmento === "agenda" && (
        <Cartao titulo="Minha agenda">
          <p className="text-ink-soft">
            Visão semanal — bloqueie férias, almoço ou reunião.
          </p>
          <div className="mt-4 space-y-2">
            <button
              type="button"
              className="w-full rounded-sm border border-rule p-3 text-left"
            >
              + Bloquear horário
            </button>
          </div>
        </Cartao>
      )}

      {segmento === "clientes" && (
        <Cartao titulo="Meus clientes">
          {listaAgendamentos.length ? (
            listaAgendamentos.map((a) => (
              <div key={a.id} className="py-3">
                <p>{a.client?.name}</p>
                <p className="text-sm text-ink-mute">
                  {a.client?.notes ?? "Sem preferências registradas"}
                </p>
              </div>
            ))
          ) : (
            <EstadoVazio
              titulo="Dia livre"
              descricao="Nenhum agendamento para hoje."
            />
          )}
        </Cartao>
      )}

      {segmento === "carteira" && (
        <Cartao titulo="Carteira">
          {comissao.isLoading ? (
            <EstadoCarregando />
          ) : comissao.isError && usarFallbackComissao && totalComissao === 0 ? (
            <EstadoVazio
              titulo="Comissão em breve"
              descricao="Dados de comissão indisponíveis no momento."
            />
          ) : (
            <>
              <p className="font-serif text-4xl text-accent">
                {formatarBRL(totalComissao)}
              </p>
              <p className="text-sm text-ink-mute">
                Comissão acumulada · {periodoAtual}
              </p>
              {lancamentos.length > 0 ? (
                lancamentos.map((l) => (
                  <div
                    key={l.id}
                    className="mt-3 flex justify-between border-t border-rule pt-3"
                  >
                    <span>Atendimento</span>
                    <span className="font-mono">{formatarBRL(l.amount_cents)}</span>
                  </div>
                ))
              ) : usarFallbackComissao && totalComissao > 0 ? (
                <p className="mt-3 border-t border-rule pt-3 text-sm text-ink-mute">
                  Estimativa com base nos atendimentos pagos (40%).
                </p>
              ) : null}
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
          <button
            type="button"
            className="mt-4 w-full rounded-sm border border-dashed border-accent p-4 text-accent"
          >
            + Publicar corte
          </button>
        </Cartao>
      )}
    </LayoutMobile>
  );
}
