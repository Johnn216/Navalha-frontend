"use client";

import { useState } from "react";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { Entrada } from "@/compartilhado/componentes/ui/Entrada";
import { SlotHorario } from "@/compartilhado/componentes/ui/SlotHorario";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
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

export function FluxoAgendamentoPublico({ slug }: { slug: string }) {
  const { data: perfil, isLoading, isError, refetch } = usePerfilPublico(slug);
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [barbeiroId, setBarbeiroId] = useState<string | null>(null);
  const [data, setData] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slot, setSlot] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const { tema, trocarTema } = useTema();

  const { data: slots } = useDisponibilidadePublica(
    slug,
    barbeiroId ?? "",
    servicoId ?? "",
    data,
    !!barbeiroId && !!servicoId
  );

  const confirmar = useConfirmarAgendamentoPublico(slug);

  const servico = perfil?.services.find((s) => s.id === servicoId);
  const barbeiro = perfil?.barbers.find((b) => b.id === barbeiroId);

  const dias = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  if (isLoading) return <EstadoCarregando />;
  if (isError || !perfil) return <EstadoErro onTentarNovamente={() => refetch()} />;

  if (confirmado) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-serif text-4xl text-accent">Agendado!</h1>
        <p className="mt-4 text-ink-soft">Confirmação enviada por WhatsApp.</p>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-bg px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl">{perfil.name}</h1>
            <p className="text-ink-soft">{perfil.city}</p>
          </div>
          <SeletorTema tema={tema} onTrocar={trocarTema} compacto />
        </div>

        <section className="mb-8">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-mute">1 · Serviço</h2>
          <div className="space-y-2">
            {perfil.services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setServicoId(s.id); setSlot(null); }}
                className={cn(
                  "flex w-full min-h-[44px] items-center justify-between rounded-sm border p-3 text-left",
                  servicoId === s.id ? "border-accent bg-accent/10" : "border-rule"
                )}
              >
                <span>{s.name}</span>
                <span className="font-mono text-sm">{formatarBRL(s.price_cents)}</span>
              </button>
            ))}
          </div>
        </section>

        {servicoId && (
          <section className="mb-8">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-mute">2 · Barbeiro</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {perfil.barbers.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => { setBarbeiroId(b.id); setSlot(null); }}
                  className={cn(
                    "rounded-lg border p-4 text-left",
                    barbeiroId === b.id ? "border-accent bg-accent/10" : "border-rule"
                  )}
                >
                  <p className="font-serif text-lg">{b.display_name}</p>
                  <p className="text-sm text-ink-mute">★ {b.rating_avg}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {barbeiroId && (
          <section className="mb-8">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-mute">3 · Data</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dias.map((d) => {
                const iso = format(d, "yyyy-MM-dd");
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => { setData(iso); setSlot(null); }}
                    className={cn(
                      "min-h-[44px] shrink-0 rounded-sm border px-3 py-2 font-mono text-sm",
                      data === iso ? "border-accent bg-accent/10" : "border-rule"
                    )}
                  >
                    {format(d, "EEE dd", { locale: ptBR })}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {barbeiroId && servicoId && (
          <section className="mb-8">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-mute">4 · Horário</h2>
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
          </section>
        )}

        {slot && (
          <Cartao titulo="Confirmação" className="mb-8">
            <div className="space-y-2 text-sm">
              <p><strong>Serviço:</strong> {servico?.name}</p>
              <p><strong>Barbeiro:</strong> {barbeiro?.display_name}</p>
              <p><strong>Horário:</strong> {formatarHora(slot)}</p>
              <p><strong>Total:</strong> {servico && formatarBRL(servico.price_cents)}</p>
            </div>
            <div className="mt-4 grid gap-3">
              <Entrada rotulo="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              <Entrada rotulo="WhatsApp" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </div>
            <Botao className="mt-4 w-full" onClick={handleConfirmar} disabled={confirmar.isPending}>
              Confirmar agendamento
            </Botao>
          </Cartao>
        )}
      </div>
    </div>
  );
}
