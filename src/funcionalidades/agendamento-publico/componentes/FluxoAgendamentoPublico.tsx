"use client";

import { useState } from "react";
import Image from "next/image";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { Entrada } from "@/compartilhado/componentes/ui/Entrada";
import { SlotHorario } from "@/compartilhado/componentes/ui/SlotHorario";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import { EstadoErro } from "@/compartilhado/componentes/feedback/EstadoErro";
import { formatarBRL } from "@/compartilhado/lib/formatadores/moeda";
import { formatarHora } from "@/compartilhado/lib/formatadores/data-hora";
import {
  usePerfilPublico,
  useDisponibilidadePublica,
  useConfirmarAgendamentoPublico,
} from "@/funcionalidades/agendamento-publico/hooks/useAgendamentoPublico";
import { SeletorTema } from "@/compartilhado/componentes/ui/SeletorTema";
import { useTema } from "@/compartilhado/hooks/useTema";
import { cn } from "@/compartilhado/lib/utilitarios/cn";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MapPin,
  Star,
  CheckCircle,
  ChevronLeft,
  Clock,
  Scissors,
  User,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// ── Barra de progresso ─────────────────────────────────────────────
const PASSOS = ["Serviço", "Barbeiro", "Data & Hora", "Confirmação"];

function BarraProgresso({ passoAtual }: { passoAtual: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {PASSOS.map((nome, idx) => {
          const numero = idx + 1;
          const concluido = passoAtual > numero;
          const ativo = passoAtual === numero;
          return (
            <div key={nome} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition-all duration-300",
                    concluido
                      ? "border-accent bg-accent text-accent-ink"
                      : ativo
                      ? "border-accent text-accent"
                      : "border-rule text-ink-mute"
                  )}
                >
                  {concluido ? <CheckCircle className="h-4 w-4" /> : numero}
                </div>
                <span
                  className={cn(
                    "hidden font-mono text-[10px] uppercase tracking-wider sm:block",
                    ativo ? "text-accent" : "text-ink-mute"
                  )}
                >
                  {nome}
                </span>
              </div>
              {idx < PASSOS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 transition-all duration-500",
                    concluido ? "bg-accent" : "bg-rule"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Card de serviço ────────────────────────────────────────────────
function CardServico({
  servico,
  selecionado,
  onClick,
}: {
  servico: { id: string; name: string; duration_min: number; price_cents: number };
  selecionado: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all duration-200",
        selecionado
          ? "border-accent bg-accent/10 shadow-[0_0_16px_color-mix(in_oklab,var(--accent)_15%,transparent)]"
          : "border-rule hover:border-accent/40 hover:bg-bg-soft"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
            selecionado ? "border-accent bg-accent/20 text-accent" : "border-rule text-ink-mute"
          )}
        >
          <Scissors className="h-4 w-4" />
        </div>
        <div>
          <p className={cn("font-medium", selecionado ? "text-ink" : "text-ink")}>{servico.name}</p>
          <p className="flex items-center gap-1 font-mono text-xs text-ink-mute">
            <Clock className="h-3 w-3" />
            {servico.duration_min} min
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn("font-serif text-lg", selecionado ? "text-accent" : "text-ink")}>
          {formatarBRL(servico.price_cents)}
        </p>
        {selecionado && (
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent">Selecionado</p>
        )}
      </div>
    </button>
  );
}

// ── Card de barbeiro ───────────────────────────────────────────────
function CardBarbeiro({
  barbeiro,
  selecionado,
  onClick,
}: {
  barbeiro: { id: string; display_name: string; rating_avg: number; specialties?: string[] };
  selecionado: boolean;
  onClick: () => void;
}) {
  const iniciais = barbeiro.display_name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col rounded-xl border p-5 text-left transition-all duration-200",
        selecionado
          ? "border-accent bg-accent/10 shadow-[0_0_16px_color-mix(in_oklab,var(--accent)_15%,transparent)]"
          : "border-rule hover:border-accent/40 hover:bg-bg-soft"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full border-2 font-serif text-xl font-medium transition-all",
            selecionado ? "border-accent bg-accent/20 text-accent" : "border-rule bg-bg-elev text-ink-soft"
          )}
        >
          {iniciais}
        </div>
        <div className="flex-1">
          <p className="font-serif text-lg text-ink">{barbeiro.display_name}</p>
          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(barbeiro.rating_avg)
                    ? "fill-accent text-accent"
                    : "fill-rule text-rule"
                )}
              />
            ))}
            <span className="ml-1 font-mono text-xs text-ink-mute">{barbeiro.rating_avg}</span>
          </div>
        </div>
        {selecionado && (
          <CheckCircle className="h-5 w-5 shrink-0 text-accent" />
        )}
      </div>
      {barbeiro.specialties && barbeiro.specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {barbeiro.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full border border-rule px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-mute"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

// ── Componente principal ───────────────────────────────────────────
export function FluxoAgendamentoPublico({ slug }: { slug: string }) {
  const { data: perfil, isLoading, isError, refetch } = usePerfilPublico(slug);
  const [passo, setPasso] = useState(1);
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [barbeiroId, setBarbeiroId] = useState<string | null>(null);
  const [data, setData] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slot, setSlot] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const { tema, trocarTema } = useTema();

  const { data: slots, isLoading: carregandoSlots } = useDisponibilidadePublica(
    slug,
    barbeiroId ?? "",
    servicoId ?? "",
    data,
    !!barbeiroId && !!servicoId && passo === 3
  );

  const confirmar = useConfirmarAgendamentoPublico(slug);

  const servico = perfil?.services.find((s) => s.id === servicoId);
  const barbeiro = perfil?.barbers.find((b) => b.id === barbeiroId);
  const dias = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const handleConfirmar = () => {
    if (!servicoId || !barbeiroId || !slot || !nome || !telefone) return;
    confirmar.mutate(
      {
        client: { name: nome, phone: telefone },
        barber_id: barbeiroId,
        service_ids: [servicoId],
        starts_at: slot,
      },
      { onSuccess: () => setConfirmado(true) }
    );
  };

  if (isLoading) return <EstadoCarregando />;
  if (isError || !perfil) return <EstadoErro onTentarNovamente={() => refetch()} />;

  // ── Tela de confirmação final ──────────────────────────────────
  if (confirmado) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
            <CheckCircle className="h-10 w-10 text-accent" />
          </div>
          <h1 className="mt-6 font-serif text-4xl text-ink">
            Agendamento <span className="italic text-accent">confirmado!</span>
          </h1>
          <p className="mt-3 text-ink-soft">
            Enviamos a confirmação pelo WhatsApp. Qualquer dúvida, entre em contato com a barbearia.
          </p>

          <div className="mt-8 w-full rounded-xl border border-rule bg-bg-card p-6 text-left">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
              Resumo do agendamento
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Scissors className="h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="text-sm text-ink-mute">Serviço</p>
                  <p className="font-medium text-ink">{servico?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="text-sm text-ink-mute">Barbeiro</p>
                  <p className="font-medium text-ink">{barbeiro?.display_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="text-sm text-ink-mute">Horário</p>
                  <p className="font-medium text-ink">{slot && formatarHora(slot)} · {format(new Date(data), "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
                </div>
              </div>
              <div className="border-t border-rule pt-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-ink-mute">Total</p>
                  <p className="font-serif text-xl text-accent">{servico && formatarBRL(servico.price_cents)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg border border-ok/30 bg-ok/10 px-4 py-3 text-sm text-ok">
            <MessageSquare className="h-4 w-4 shrink-0" />
            Você receberá uma confirmação via WhatsApp em breve.
          </div>
        </div>
      </div>
    );
  }

  // ── Layout principal ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg">
      {/* Cabeçalho da barbearia */}
      <div className="relative h-40 overflow-hidden border-b border-rule md:h-56">
        <Image
          src="/img/hero-barbearia.jpg"
          alt={perfil.name}
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 pb-4 md:px-8">
          <div>
            <h1 className="font-serif text-3xl text-ink md:text-4xl">{perfil.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 font-mono text-sm text-ink-soft">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {perfil.city}
              </span>
              <span className="flex items-center gap-1 font-mono text-sm text-accent">
                <Star className="h-3.5 w-3.5 fill-accent" />
                4,8 · 127 avaliações
              </span>
            </div>
          </div>
          <SeletorTema tema={tema} onTrocar={trocarTema} compacto />
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-8">
        <BarraProgresso passoAtual={passo} />

        {/* ── PASSO 1 — Serviço ─────────────────────────────── */}
        {passo === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="font-serif text-2xl text-ink">Qual serviço?</h2>
              <p className="mt-1 text-sm text-ink-soft">Escolha o serviço que deseja realizar.</p>
            </div>
            <div className="space-y-3">
              {perfil.services.map((s) => (
                <CardServico
                  key={s.id}
                  servico={s}
                  selecionado={servicoId === s.id}
                  onClick={() => setServicoId(s.id)}
                />
              ))}
            </div>
            {servicoId && (
              <Botao
                className="mt-6 w-full"
                onClick={() => setPasso(2)}
              >
                Continuar → Escolher barbeiro
              </Botao>
            )}
          </div>
        )}

        {/* ── PASSO 2 — Barbeiro ────────────────────────────── */}
        {passo === 2 && (
          <div>
            <button
              type="button"
              onClick={() => setPasso(1)}
              className="mb-4 flex items-center gap-1 font-mono text-xs text-ink-mute hover:text-ink"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Voltar
            </button>
            <div className="mb-6">
              <h2 className="font-serif text-2xl text-ink">Qual barbeiro?</h2>
              <p className="mt-1 text-sm text-ink-soft">Escolha quem vai te atender.</p>
            </div>
            <div className="space-y-3">
              {perfil.barbers.map((b) => (
                <CardBarbeiro
                  key={b.id}
                  barbeiro={{ ...b, specialties: ["Corte degradê", "Barba"] }}
                  selecionado={barbeiroId === b.id}
                  onClick={() => setBarbeiroId(b.id)}
                />
              ))}
            </div>
            {barbeiroId && (
              <Botao
                className="mt-6 w-full"
                onClick={() => setPasso(3)}
              >
                Continuar → Escolher horário
              </Botao>
            )}
          </div>
        )}

        {/* ── PASSO 3 — Data & Hora ─────────────────────────── */}
        {passo === 3 && (
          <div>
            <button
              type="button"
              onClick={() => setPasso(2)}
              className="mb-4 flex items-center gap-1 font-mono text-xs text-ink-mute hover:text-ink"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Voltar
            </button>
            <div className="mb-6">
              <h2 className="font-serif text-2xl text-ink">Data & Horário</h2>
              <p className="mt-1 text-sm text-ink-soft">Escolha o melhor dia e horário.</p>
            </div>

            {/* Seletor de data */}
            <div className="mb-6">
              <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                <Calendar className="h-3.5 w-3.5" /> Data
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dias.map((d) => {
                  const iso = format(d, "yyyy-MM-dd");
                  const ativo = data === iso;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => { setData(iso); setSlot(null); }}
                      className={cn(
                        "flex shrink-0 flex-col items-center rounded-xl border px-3 py-2 transition-all",
                        ativo
                          ? "border-accent bg-accent/10 text-accent shadow-[0_0_12px_color-mix(in_oklab,var(--accent)_20%,transparent)]"
                          : "border-rule text-ink-soft hover:border-accent/40"
                      )}
                    >
                      <span className="font-mono text-[10px] uppercase">
                        {format(d, "EEE", { locale: ptBR })}
                      </span>
                      <span className="font-serif text-lg leading-tight">
                        {format(d, "dd")}
                      </span>
                      <span className="font-mono text-[9px] text-ink-mute">
                        {format(d, "MMM", { locale: ptBR })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slots de horário */}
            <div>
              <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                <Clock className="h-3.5 w-3.5" /> Horários disponíveis
              </p>
              {carregandoSlots ? (
                <div className="flex items-center gap-2 py-4 text-sm text-ink-mute">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-rule border-t-accent" />
                  Verificando disponibilidade...
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {slots?.map((s) => (
                    <SlotHorario
                      key={s.starts_at}
                      hora={formatarHora(s.starts_at)}
                      indisponivel={s.status === "TAKEN"}
                      selecionado={slot === s.starts_at}
                      onClick={() => s.status !== "TAKEN" && setSlot(s.starts_at)}
                    />
                  ))}
                </div>
              )}
            </div>

            {slot && (
              <Botao className="mt-6 w-full" onClick={() => setPasso(4)}>
                Continuar → Confirmar dados
              </Botao>
            )}
          </div>
        )}

        {/* ── PASSO 4 — Confirmação ─────────────────────────── */}
        {passo === 4 && (
          <div>
            <button
              type="button"
              onClick={() => setPasso(3)}
              className="mb-4 flex items-center gap-1 font-mono text-xs text-ink-mute hover:text-ink"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Voltar
            </button>
            <div className="mb-6">
              <h2 className="font-serif text-2xl text-ink">Confirme seus dados</h2>
              <p className="mt-1 text-sm text-ink-soft">Quase lá! Preencha seu nome e WhatsApp.</p>
            </div>

            {/* Resumo */}
            <div className="mb-6 rounded-xl border border-rule bg-bg-card p-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                Resumo do agendamento
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-bg-soft p-3">
                  <p className="font-mono text-[10px] text-ink-mute">Serviço</p>
                  <p className="mt-0.5 font-medium text-ink">{servico?.name}</p>
                  <p className="font-serif text-accent">{servico && formatarBRL(servico.price_cents)}</p>
                </div>
                <div className="rounded-lg bg-bg-soft p-3">
                  <p className="font-mono text-[10px] text-ink-mute">Barbeiro</p>
                  <p className="mt-0.5 font-medium text-ink">{barbeiro?.display_name}</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="font-mono text-xs text-ink-mute">{barbeiro?.rating_avg}</span>
                  </div>
                </div>
                <div className="col-span-2 rounded-lg bg-bg-soft p-3">
                  <p className="font-mono text-[10px] text-ink-mute">Data & Horário</p>
                  <p className="mt-0.5 font-medium text-ink">
                    {slot && formatarHora(slot)} · {format(new Date(data), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="space-y-4">
              <Entrada
                rotulo="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Ricardo Albuquerque"
              />
              <Entrada
                rotulo="WhatsApp (com DDD)"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/5 p-3 text-sm text-ink-soft">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>Você receberá a confirmação e lembretes automáticos via WhatsApp.</span>
            </div>

            <Botao
              className="mt-6 w-full"
              onClick={handleConfirmar}
              disabled={confirmar.isPending || !nome || !telefone}
            >
              {confirmar.isPending ? "Confirmando..." : "Confirmar agendamento →"}
            </Botao>
          </div>
        )}
      </div>
    </div>
  );
}
