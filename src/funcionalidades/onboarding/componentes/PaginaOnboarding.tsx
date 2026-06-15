"use client";

import { useState } from "react";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { Entrada } from "@/compartilhado/componentes/ui/Entrada";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import { EstadoErro } from "@/compartilhado/componentes/feedback/EstadoErro";
import { formatarBRL } from "@/compartilhado/lib/formatadores/moeda";
import {
  useOnboarding,
  useServicosOnboarding,
  useSalvarPasso,
  usePublicarOnboarding,
} from "@/funcionalidades/onboarding/hooks/useOnboarding";
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";
import { SeletorTema } from "@/compartilhado/componentes/ui/SeletorTema";
import { useTema } from "@/compartilhado/hooks/useTema";
import { Check } from "lucide-react";
import { cn } from "@/compartilhado/lib/utilitarios/cn";
import Link from "next/link";

const PASSOS = [
  { n: 1, titulo: "Dados da barbearia", tempo: "2min" },
  { n: 2, titulo: "Equipe", tempo: "3min" },
  { n: 3, titulo: "Serviços", tempo: "5min" },
  { n: 4, titulo: "Horários", tempo: "4min" },
  { n: 5, titulo: "Integrações", tempo: "2min" },
  { n: 6, titulo: "Publicar", tempo: "1min" },
];

export function PaginaOnboarding() {
  const { unidadeId } = useUnidadeAtiva();
  const { data: onboarding, isLoading, isError, refetch } = useOnboarding();
  const { data: servicos } = useServicosOnboarding(unidadeId);
  const salvar = useSalvarPasso();
  const publicar = usePublicarOnboarding();
  const { tema, trocarTema } = useTema();
  const [passoLocal, setPassoLocal] = useState<number | null>(null);
  const passoAtual = passoLocal ?? onboarding?.current_step ?? 1;

  if (isLoading) return <EstadoCarregando mensagem="Carregando onboarding..." />;
  if (isError) return <EstadoErro onTentarNovamente={() => refetch()} />;

  const avancar = () => {
    salvar.mutate({ n: passoAtual, dados: {} });
    if (passoAtual < 6) setPassoLocal(passoAtual + 1);
    else publicar.mutate(undefined, { onSuccess: () => window.location.href = "/dono" });
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="grid min-h-screen lg:grid-cols-[340px_1fr]">
        <aside className="border-b border-rule bg-bg-soft p-6 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent font-serif italic text-accent">N</span>
            <span className="font-serif tracking-widest">NAVALHA</span>
          </Link>
          <ol className="mt-8 space-y-4 overflow-x-auto lg:overflow-visible">
            {PASSOS.map((p) => {
              const done = (onboarding?.steps.find((s) => s.n === p.n)?.done) || p.n < passoAtual;
              const current = p.n === passoAtual;
              return (
                <li key={p.n} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
                      done && "border-accent bg-accent text-accent-ink",
                      current && !done && "border-accent ring-2 ring-accent/30",
                      !done && !current && "border-rule text-ink-mute"
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : p.n}
                  </span>
                  <div>
                    <p className={cn("text-sm", current && "text-accent")}>{p.titulo}</p>
                    <p className="font-mono text-[10px] text-ink-mute">{p.tempo}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-8 flex items-center gap-2 font-mono text-[10px] text-ok">
            <span className="h-2 w-2 animate-pulse rounded-full bg-ok" />
            Salvo automaticamente
          </p>
        </aside>

        <main className="p-6 lg:p-12">
          <div className="mb-8 flex justify-end">
            <SeletorTema tema={tema} onTrocar={trocarTema} />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
            § Passo {passoAtual} de 6
          </p>
          <h1 className="mt-2 font-serif text-4xl">{PASSOS[passoAtual - 1]?.titulo}</h1>

          {passoAtual === 1 && (
            <Cartao className="mt-8" titulo="Dados da barbearia">
              <div className="grid gap-4 md:grid-cols-2">
                <Entrada rotulo="Nome da barbearia" defaultValue="Navalha · Centro" />
                <Entrada rotulo="Cidade" defaultValue="São Paulo" />
                <Entrada rotulo="Endereço" defaultValue="Rua das Flores, 142" className="md:col-span-2" />
              </div>
            </Cartao>
          )}

          {passoAtual === 2 && (
            <Cartao className="mt-8" titulo="Equipe">
              <p className="text-ink-soft">Convide barbeiros e recepcionistas por e-mail.</p>
              <Entrada rotulo="E-mail do barbeiro" className="mt-4" placeholder="rafael@navalha.com" />
            </Cartao>
          )}

          {passoAtual === 3 && (
            <Cartao className="mt-8" titulo="Serviços">
              <p className="mb-4 text-sm text-ink-soft">Importe de planilha ou selecione abaixo.</p>
              <div className="space-y-2">
                {servicos?.map((s) => (
                  <label key={s.id} className="flex cursor-pointer items-center justify-between rounded-sm border border-rule p-3 hover:border-accent">
                    <span>{s.name}</span>
                    <span className="font-mono text-sm text-accent">
                      {formatarBRL(s.price_cents)} · {s.duration_min}min
                    </span>
                  </label>
                ))}
              </div>
            </Cartao>
          )}

          {passoAtual === 4 && (
            <Cartao className="mt-8" titulo="Horários">
              <p className="text-ink-soft">Seg–Sáb 09:00–19:00 (padrão)</p>
            </Cartao>
          )}

          {passoAtual === 5 && (
            <Cartao className="mt-8" titulo="Integrações">
              <p className="text-ink-soft">WhatsApp Business e Pix configurados no trial.</p>
            </Cartao>
          )}

          {passoAtual === 6 && (
            <Cartao className="mt-8" titulo="Publicar">
              <p className="text-ink-soft">Ative booking público e marketplace.</p>
            </Cartao>
          )}

          <div className="mt-8 flex gap-3">
            {passoAtual > 1 && (
              <Botao variante="secundario" onClick={() => setPassoLocal(passoAtual - 1)}>
                Voltar
              </Botao>
            )}
            <Botao onClick={avancar} disabled={salvar.isPending || publicar.isPending}>
              {passoAtual === 6 ? "Publicar →" : "Próximo →"}
            </Botao>
          </div>
        </main>
      </div>
    </div>
  );
}
