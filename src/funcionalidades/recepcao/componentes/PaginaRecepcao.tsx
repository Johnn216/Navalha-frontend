"use client";

import { LayoutApp } from "@/compartilhado/layouts/LayoutApp";
import { SeloKpi } from "@/compartilhado/componentes/ui/SeloKpi";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { Selo } from "@/compartilhado/componentes/ui/Selo";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import { EstadoErro } from "@/compartilhado/componentes/feedback/EstadoErro";
import { formatarBRL } from "@/compartilhado/lib/formatadores/moeda";
import { formatarHora } from "@/compartilhado/lib/formatadores/data-hora";
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";
import { useTempoReal } from "@/compartilhado/hooks/useTempoReal";
import {
  useAgendamentosDoDia,
  useFilaEspera,
  useCaixaAtual,
  useInboxWhatsApp,
  useEstoque,
} from "@/funcionalidades/recepcao/hooks/useRecepcao";
import { PainelCaixa } from "@/funcionalidades/caixa/componentes/PainelCaixa";
import { InboxWhatsApp } from "@/funcionalidades/recepcao/componentes/InboxWhatsApp";
import { cn } from "@/compartilhado/lib/utilitarios/cn";

const NAV = [
  { href: "/recepcao", rotulo: "Recepção" },
  { href: "/recepcao/agenda", rotulo: "Agenda", badge: 38 },
  { href: "/recepcao/caixa", rotulo: "Caixa" },
  { href: "/recepcao/whatsapp", rotulo: "WhatsApp", badge: 7 },
  { href: "/recepcao/fila", rotulo: "Fila", badge: 5 },
  { href: "/recepcao/estoque", rotulo: "Estoque" },
];

const STATUS_MAP: Record<string, { rotulo: string; variante: "ok" | "accent" | "aviso" | "perigo" }> = {
  IN_SERVICE: { rotulo: "Em atendimento", variante: "ok" },
  CONFIRMED: { rotulo: "Confirmado", variante: "accent" },
  PENDING: { rotulo: "Aguardando", variante: "aviso" },
  PAID: { rotulo: "Pago", variante: "ok" },
};

function BadgeRiscoNoShow({ risco }: { risco?: number }) {
  if (!risco || risco < 0.5) return null;
  return (
    <Selo variante={risco > 0.7 ? "perigo" : "aviso"} className="ml-2">
      No-show {Math.round(risco * 100)}%
    </Selo>
  );
}

export function PaginaRecepcao({ segmento = "recepcao" }: { segmento?: string }) {
  const { unidadeId } = useUnidadeAtiva();
  useTempoReal(unidadeId);
  const hoje = new Date().toISOString().split("T")[0];
  const agendamentos = useAgendamentosDoDia(unidadeId, hoje);
  const fila = useFilaEspera(unidadeId);
  const caixa = useCaixaAtual(unidadeId);
  const whatsapp = useInboxWhatsApp(unidadeId);
  const estoque = useEstoque(unidadeId);

  const emAtendimento = agendamentos.data?.data.filter((a) => a.status === "IN_SERVICE").length ?? 0;

  if (agendamentos.isLoading) return <EstadoCarregando />;
  if (agendamentos.isError) return <EstadoErro onTentarNovamente={() => agendamentos.refetch()} />;

  return (
    <LayoutApp itensNav={NAV} titulo="Recepção">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">Recepção · agora</p>
        <h2 className="font-serif text-3xl">Operação ao vivo</h2>
      </div>

      {segmento === "recepcao" && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <SeloKpi rotulo="Em atendimento" valor={String(emAtendimento)} />
            <SeloKpi rotulo="Na fila" valor={String(fila.data?.length ?? 5)} />
            <SeloKpi
              rotulo="Caixa"
              valor={formatarBRL(caixa.data?.expected_cents ?? 84000)}
            />
          </div>

          <Cartao titulo="Agenda consolidada" className="mb-8">
            <div className="space-y-3">
              {agendamentos.data?.data.map((a) => {
                const st = STATUS_MAP[a.status] ?? { rotulo: a.status, variante: "padrao" as const };
                return (
                  <div
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-rule p-3"
                  >
                    <div>
                      <span className="font-mono text-xs text-ink-mute">{a.code}</span>
                      <span className="mx-2 font-mono tabular-nums">{formatarHora(a.starts_at)}</span>
                      <span>{a.client?.name}</span>
                      <span className="mx-2 text-ink-mute">·</span>
                      <span className="text-ink-soft">{a.barber?.display_name}</span>
                      <BadgeRiscoNoShow risco={a.no_show_risk} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Selo variante={st.variante}>{st.rotulo}</Selo>
                      <span className="font-mono text-sm">{formatarBRL(a.total_cents)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Cartao>

          <div className="grid gap-6 lg:grid-cols-2">
            <InboxWhatsApp mensagens={whatsapp.data ?? []} carregando={whatsapp.isLoading} />
            <Cartao titulo="Fila de espera">
              {fila.data?.map((item) => (
                <div key={item.id} className="border-b border-rule py-2 last:border-0">
                  <p>{item.client_name}</p>
                  <p className="text-sm text-ink-mute">{item.service_name}</p>
                </div>
              )) ?? <p className="text-ink-mute">5 na fila</p>}
            </Cartao>
          </div>
        </>
      )}

      {segmento === "agenda" && (
        <Cartao titulo="Agenda · todos os barbeiros">
          {agendamentos.data?.data.map((a) => (
            <div key={a.id} className="flex justify-between border-b border-rule py-3">
              <span>{a.barber?.display_name} — {a.client?.name}</span>
              <span className="font-mono">{formatarHora(a.starts_at)}</span>
            </div>
          ))}
        </Cartao>
      )}

      {segmento === "caixa" && <PainelCaixa sessao={caixa.data} />}
      {segmento === "whatsapp" && <InboxWhatsApp mensagens={whatsapp.data ?? []} carregando={whatsapp.isLoading} />}
      {segmento === "fila" && (
        <Cartao titulo="Fila de espera">
          {fila.data?.map((item) => (
            <div key={item.id} className="py-3">{item.client_name} — {item.service_name}</div>
          ))}
        </Cartao>
      )}
      {segmento === "estoque" && (
        <Cartao titulo="Estoque">
          <div className="space-y-2">
            {estoque.data?.map((p) => (
              <div key={p.id} className={cn("flex justify-between py-2", p.low_stock && "text-danger")}>
                <span>{p.name}</span>
                <span className="font-mono">{p.qty} un {p.low_stock && "· Baixo!"}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-mute">Fiscal NFS-e: emissão automática no fechamento</p>
        </Cartao>
      )}
    </LayoutApp>
  );
}
