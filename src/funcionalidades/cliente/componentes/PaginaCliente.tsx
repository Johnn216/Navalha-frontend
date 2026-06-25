"use client";

import { useState } from "react";
import { LayoutMobile } from "@/compartilhado/layouts/LayoutMobile";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { Selo } from "@/compartilhado/componentes/ui/Selo";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { SlotHorario } from "@/compartilhado/componentes/ui/SlotHorario";
import { formatarBRL } from "@/compartilhado/lib/formatadores/moeda";
import { formatarHora } from "@/compartilhado/lib/formatadores/data-hora";
import { useQuery } from "@tanstack/react-query";
import { listarServicos } from "@/compartilhado/lib/api/servicos/servicos.servico";
import { listarBarbeiros } from "@/compartilhado/lib/api/servicos/barbeiros.servico";
import { obterDisponibilidade } from "@/compartilhado/lib/api/servicos/disponibilidade.servico";
import { obterFidelidade } from "@/compartilhado/lib/api/servicos/fidelidade.servico";
import { listarPlanos } from "@/compartilhado/lib/api/servicos/planos.servico";
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";
import { useSessao } from "@/funcionalidades/autenticacao/hooks/useSessao";
import {
  Calendar,
  Home,
  Gift,
  User,
  Scissors,
  Clock,
  Star,
  ChevronLeft,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/compartilhado/lib/utilitarios/cn";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { chavesConsultaCliente } from "@/funcionalidades/cliente/chaves-consulta";

const CLIENTE_DEMO_ID = "client-ricardo";

const ABAS = [
  { href: "/cliente", rotulo: "Início", icone: Home },
  { href: "/cliente/agendar", rotulo: "Agendar", icone: Calendar },
  { href: "/cliente/fidelidade", rotulo: "Clube", icone: Gift },
  { href: "/cliente/perfil", rotulo: "Perfil", icone: User },
];

export function PaginaCliente({ segmento = "inicio" }: { segmento?: string }) {
  const { unidadeId } = useUnidadeAtiva();
  const { usuario } = useSessao();
  const [passo, setPasso] = useState(1);
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [barbeiroId, setBarbeiroId] = useState<string | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slotSelecionado, setSlotSelecionado] = useState<string | null>(null);
  const [agendado, setAgendado] = useState(false);
  const clienteId = usuario?.id ?? CLIENTE_DEMO_ID;

  const servicos = useQuery({
    queryKey: chavesConsultaCliente.servicos(unidadeId),
    queryFn: () => listarServicos(unidadeId),
    enabled: !!unidadeId,
  });
  const barbeiros = useQuery({
    queryKey: chavesConsultaCliente.barbeiros(unidadeId),
    queryFn: () => listarBarbeiros(unidadeId),
    enabled: !!unidadeId,
  });
  const slots = useQuery({
    queryKey: chavesConsultaCliente.slots(unidadeId, barbeiroId ?? "", servicoId ?? "", dataSelecionada),
    queryFn: () =>
      obterDisponibilidade({
        unit_id: unidadeId,
        barber_id: barbeiroId!,
        service_id: servicoId!,
        date: dataSelecionada,
      }),
    enabled: !!unidadeId && !!barbeiroId && !!servicoId && passo === 3,
  });
  const fidelidade = useQuery({
    queryKey: chavesConsultaCliente.fidelidade(clienteId),
    queryFn: () => obterFidelidade(clienteId),
    enabled: !!clienteId,
  });
  const planos = useQuery({
    queryKey: chavesConsultaCliente.planos(),
    queryFn: listarPlanos,
  });

  const servico = servicos.data?.find((s) => s.id === servicoId);
  const barbeiro = barbeiros.data?.find((b) => b.id === barbeiroId);
  const dias = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
  const stamps = fidelidade.data?.stamps ?? 8;

  return (
    <LayoutMobile abas={ABAS} titulo="Navalha">

      {/* ── Início ─────────────────────────────────────────────── */}
      {segmento === "inicio" && (
        <>
          {/* Próximo agendamento */}
          <div className="mb-4 overflow-hidden rounded-xl border border-accent/30 bg-bg-card">
            <div className="barber-pole h-1" />
            <div className="p-4">
              <Selo variante="accent" className="mb-2">Platinum</Selo>
              <h2 className="font-serif text-2xl text-ink">Próximo corte</h2>
              <p className="font-mono text-accent">Hoje · 14:30 · Rafael</p>
              <p className="mt-1 text-sm text-ink-soft">Corte degradê + Barba</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-bg-soft p-3 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">Em</p>
                  <p className="font-serif text-lg text-ink">2h 15min</p>
                </div>
                <div className="rounded-lg bg-bg-soft p-3 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">Total</p>
                  <p className="font-serif text-lg text-accent">R$ 80</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fidelidade */}
          <Cartao titulo="Fidelidade">
            <p className="mb-3 text-sm text-ink-soft">{stamps}/10 selos para corte grátis</p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                    i < stamps
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-rule text-rule"
                  )}
                >
                  {i < stamps ? <Scissors className="h-4 w-4" /> : <span className="h-4 w-4" />}
                </div>
              ))}
            </div>
            {stamps >= 10 && (
              <div className="mt-3 rounded-lg border border-ok/30 bg-ok/10 p-3 text-sm text-ok">
                🎉 Você tem um corte grátis disponível!
              </div>
            )}
          </Cartao>
        </>
      )}

      {/* ── Agendar ────────────────────────────────────────────── */}
      {segmento === "agendar" && (
        <div>
          {agendado ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h2 className="mt-4 font-serif text-2xl text-ink">Agendado!</h2>
              <p className="mt-2 text-sm text-ink-soft">
                {servico?.name} com {barbeiro?.display_name} às {slotSelecionado && formatarHora(slotSelecionado)}.
              </p>
              <p className="mt-1 font-mono text-xs text-ok">Confirmação enviada por WhatsApp.</p>
              <Botao
                className="mt-6"
                variante="secundario"
                onClick={() => { setPasso(1); setServicoId(null); setBarbeiroId(null); setSlotSelecionado(null); setAgendado(false); }}
              >
                Novo agendamento
              </Botao>
            </div>
          ) : (
            <>
              {/* Indicador de passo */}
              <div className="mb-6 flex items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-2">
                    <div className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[10px]",
                      passo === n ? "border-accent bg-accent text-accent-ink" : passo > n ? "border-accent bg-accent/20 text-accent" : "border-rule text-ink-mute"
                    )}>
                      {passo > n ? "✓" : n}
                    </div>
                    {n < 3 && <div className={cn("h-px w-6 flex-1", passo > n ? "bg-accent" : "bg-rule")} />}
                  </div>
                ))}
                <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  {passo === 1 ? "Serviço" : passo === 2 ? "Barbeiro" : "Horário"}
                </span>
              </div>

              {/* Passo 1 — Serviço */}
              {passo === 1 && (
                <>
                  <h2 className="mb-4 font-serif text-2xl text-ink">Qual serviço?</h2>
                  <div className="space-y-2">
                    {servicos.data?.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => { setServicoId(s.id); setPasso(2); }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all",
                          servicoId === s.id ? "border-accent bg-accent/10" : "border-rule hover:border-accent/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-bg-soft">
                            <Scissors className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-ink">{s.name}</p>
                            <p className="flex items-center gap-1 font-mono text-xs text-ink-mute">
                              <Clock className="h-3 w-3" /> {s.duration_min} min
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-accent">{formatarBRL(s.price_cents)}</span>
                          <ChevronRight className="h-4 w-4 text-ink-mute" />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Passo 2 — Barbeiro */}
              {passo === 2 && (
                <>
                  <button type="button" onClick={() => setPasso(1)} className="mb-3 flex items-center gap-1 font-mono text-xs text-ink-mute">
                    <ChevronLeft className="h-3.5 w-3.5" /> Voltar
                  </button>
                  <h2 className="mb-4 font-serif text-2xl text-ink">Qual barbeiro?</h2>
                  <div className="space-y-3">
                    {barbeiros.data?.map((b) => {
                      const iniciais = b.display_name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => { setBarbeiroId(b.id); setPasso(3); }}
                          className={cn(
                            "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
                            barbeiroId === b.id ? "border-accent bg-accent/10" : "border-rule hover:border-accent/30"
                          )}
                        >
                          <div className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full border-2 font-serif text-lg",
                            barbeiroId === b.id ? "border-accent bg-accent/20 text-accent" : "border-rule bg-bg-elev text-ink-soft"
                          )}>
                            {iniciais}
                          </div>
                          <div className="flex-1">
                            <p className="font-serif text-lg text-ink">{b.display_name}</p>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={cn("h-3 w-3", i < Math.floor(b.rating_avg) ? "fill-accent text-accent" : "fill-rule text-rule")} />
                              ))}
                              <span className="ml-1 font-mono text-xs text-ink-mute">{b.rating_avg}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-ink-mute" />
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Passo 3 — Data & Horário */}
              {passo === 3 && (
                <>
                  <button type="button" onClick={() => setPasso(2)} className="mb-3 flex items-center gap-1 font-mono text-xs text-ink-mute">
                    <ChevronLeft className="h-3.5 w-3.5" /> Voltar
                  </button>
                  <h2 className="mb-4 font-serif text-2xl text-ink">Data & Horário</h2>

                  {/* Seletor de data */}
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-mute">Data</p>
                  <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
                    {dias.map((d) => {
                      const iso = format(d, "yyyy-MM-dd");
                      const ativo = dataSelecionada === iso;
                      return (
                        <button
                          key={iso}
                          type="button"
                          onClick={() => { setDataSelecionada(iso); setSlotSelecionado(null); }}
                          className={cn(
                            "flex shrink-0 flex-col items-center rounded-xl border px-3 py-2 transition-all",
                            ativo ? "border-accent bg-accent/10 text-accent" : "border-rule text-ink-soft"
                          )}
                        >
                          <span className="font-mono text-[9px] uppercase">{format(d, "EEE", { locale: ptBR })}</span>
                          <span className="font-serif text-lg leading-tight">{format(d, "dd")}</span>
                          <span className="font-mono text-[9px] text-ink-mute">{format(d, "MMM", { locale: ptBR })}</span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-mute">Horários disponíveis</p>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.data?.filter((s) => s.status === "AVAILABLE").slice(0, 12).map((s) => (
                      <SlotHorario
                        key={s.starts_at}
                        hora={formatarHora(s.starts_at)}
                        selecionado={slotSelecionado === s.starts_at}
                        onClick={() => setSlotSelecionado(s.starts_at)}
                      />
                    ))}
                  </div>

                  {slotSelecionado && (
                    <Botao className="mt-6 w-full" onClick={() => setAgendado(true)}>
                      Confirmar — {servico?.name} · {formatarHora(slotSelecionado)}
                    </Botao>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Fidelidade ─────────────────────────────────────────── */}
      {segmento === "fidelidade" && (
        <div className="space-y-4">
          <Cartao titulo="Clube do Corte">
            {planos.data?.map((p) => (
              <div key={p.id} className="mb-4 rounded-xl border border-rule p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-ink">{p.name}</h3>
                    <p className="font-mono text-accent">{formatarBRL(p.price_cents)}/mês</p>
                  </div>
                  <Selo variante="accent">Pro</Selo>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-ink-soft">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Botao className="mt-4 w-full">Assinar plano</Botao>
              </div>
            ))}
          </Cartao>
        </div>
      )}

      {/* ── Perfil ─────────────────────────────────────────────── */}
      {segmento === "perfil" && (
        <div className="space-y-4">
          <div className="flex flex-col items-center py-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent bg-accent/20 font-serif text-3xl text-accent">
              R
            </div>
            <h2 className="mt-4 font-serif text-2xl text-ink">Ricardo Albuquerque</h2>
            <Selo variante="accent" className="mt-2">Platinum</Selo>
            <p className="mt-2 font-mono text-xs text-ink-mute">Cliente desde 2024 · 14 visitas</p>
          </div>
          <Cartao titulo="Histórico">
            <div className="space-y-3">
              {[
                { servico: "Corte degradê + Barba", barbeiro: "Rafael", data: "Hoje · 14:30", valor: "R$ 80" },
                { servico: "Corte simples", barbeiro: "Bruno", data: "15/06 · 10:00", valor: "R$ 50" },
                { servico: "Barba", barbeiro: "Rafael", data: "01/06 · 16:00", valor: "R$ 35" },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-rule p-3">
                  <div>
                    <p className="font-medium text-ink">{h.servico}</p>
                    <p className="font-mono text-xs text-ink-mute">{h.data} · {h.barbeiro}</p>
                  </div>
                  <p className="font-serif text-accent">{h.valor}</p>
                </div>
              ))}
            </div>
          </Cartao>
        </div>
      )}
    </LayoutMobile>
  );
}
