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
import { UNIT_CENTRO_ID } from "@/compartilhado/mocks/dados-sementes";
import { Calendar, Home, Gift, User } from "lucide-react";
import { cn } from "@/compartilhado/lib/utilitarios/cn";
import { format } from "date-fns";
import { chavesConsultaCliente } from "@/funcionalidades/cliente/chaves-consulta";

const CLIENTE_DEMO_ID = "client-ricardo";

const ABAS = [
  { href: "/cliente", rotulo: "Início", icone: Home },
  { href: "/cliente/agendar", rotulo: "Agendar", icone: Calendar },
  { href: "/cliente/fidelidade", rotulo: "Clube", icone: Gift },
  { href: "/cliente/perfil", rotulo: "Perfil", icone: User },
];

export function PaginaCliente({ segmento = "inicio" }: { segmento?: string }) {
  const [passo, setPasso] = useState(1);
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [barbeiroId, setBarbeiroId] = useState<string | null>(null);
  const data = format(new Date(), "yyyy-MM-dd");

  const servicos = useQuery({
    queryKey: chavesConsultaCliente.servicos(UNIT_CENTRO_ID),
    queryFn: () => listarServicos(UNIT_CENTRO_ID),
  });
  const barbeiros = useQuery({
    queryKey: chavesConsultaCliente.barbeiros(UNIT_CENTRO_ID),
    queryFn: () => listarBarbeiros(UNIT_CENTRO_ID),
  });
  const slots = useQuery({
    queryKey: chavesConsultaCliente.slots(UNIT_CENTRO_ID, barbeiroId ?? "", servicoId ?? "", data),
    queryFn: () =>
      obterDisponibilidade({
        unit_id: UNIT_CENTRO_ID,
        barber_id: barbeiroId!,
        service_id: servicoId!,
        date: data,
      }),
    enabled: !!barbeiroId && !!servicoId,
  });
  const fidelidade = useQuery({
    queryKey: chavesConsultaCliente.fidelidade(CLIENTE_DEMO_ID),
    queryFn: () => obterFidelidade(CLIENTE_DEMO_ID),
  });
  const planos = useQuery({
    queryKey: chavesConsultaCliente.planos(),
    queryFn: listarPlanos,
  });

  return (
    <LayoutMobile abas={ABAS} titulo="Navalha">
      {segmento === "inicio" && (
        <>
          <Cartao className="mb-4">
            <Selo variante="accent">Platinum</Selo>
            <h2 className="mt-2 font-serif text-2xl">Próximo corte</h2>
            <p className="font-mono text-accent">Hoje · 14:30 · Rafael</p>
            <p className="text-sm text-ink-soft">Corte degradê + Barba</p>
          </Cartao>
          <Cartao titulo="Fidelidade">
            <div className="flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-8 w-8 rounded-full border",
                    i < (fidelidade.data?.stamps ?? 8) ? "border-accent bg-accent/20" : "border-rule"
                  )}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              {fidelidade.data?.stamps ?? 8}/10 para corte grátis
            </p>
          </Cartao>
        </>
      )}

      {segmento === "agendar" && (
        <div>
          {passo === 1 && (
            <>
              <h2 className="mb-4 font-serif text-2xl">Qual serviço?</h2>
              {servicos.data?.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setServicoId(s.id); setPasso(2); }}
                  className="mb-2 flex w-full min-h-[44px] items-center justify-between rounded-sm border border-rule p-3"
                >
                  <span>{s.name}</span>
                  <span className="font-mono text-accent">{formatarBRL(s.price_cents)}</span>
                </button>
              ))}
            </>
          )}
          {passo === 2 && (
            <>
              <h2 className="mb-4 font-serif text-2xl">Qual barbeiro?</h2>
              {barbeiros.data?.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => { setBarbeiroId(b.id); setPasso(3); }}
                  className="mb-2 w-full rounded-sm border border-rule p-3 text-left"
                >
                  {b.display_name} ★ {b.rating_avg}
                </button>
              ))}
            </>
          )}
          {passo === 3 && (
            <>
              <h2 className="mb-4 font-serif text-2xl">Qual horário?</h2>
              <div className="grid grid-cols-3 gap-2">
                {slots.data?.filter((s) => s.status === "AVAILABLE").slice(0, 9).map((s) => (
                  <SlotHorario key={s.starts_at} hora={formatarHora(s.starts_at)} />
                ))}
              </div>
              <Botao className="mt-6 w-full">Confirmar</Botao>
            </>
          )}
        </div>
      )}

      {segmento === "fidelidade" && (
        <Cartao titulo="Clube do Corte">
          {planos.data?.map((p) => (
            <div key={p.id} className="mb-4 rounded-sm border border-accent/30 p-4">
              <h3 className="font-serif text-xl">{p.name}</h3>
              <p className="font-mono text-accent">{formatarBRL(p.price_cents)}/mês</p>
              <ul className="mt-2 text-sm text-ink-soft">
                {p.benefits.map((b) => <li key={b}>✓ {b}</li>)}
              </ul>
              <Botao className="mt-4 w-full">Assinar</Botao>
            </div>
          ))}
        </Cartao>
      )}

      {segmento === "perfil" && (
        <Cartao titulo="Ricardo Albuquerque">
          <p className="text-ink-soft">Cliente desde 2024 · 14 visitas</p>
          <Selo variante="accent" className="mt-2">Platinum</Selo>
        </Cartao>
      )}
    </LayoutMobile>
  );
}
