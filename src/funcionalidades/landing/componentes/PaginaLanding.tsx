"use client";

import Link from "next/link";
import { LayoutMarketing } from "@/compartilhado/layouts/LayoutMarketing";
import { Comanda } from "@/compartilhado/componentes/ui/Comanda";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { DivisorBarbearia } from "@/compartilhado/componentes/ui/DivisorBarbearia";
import { useState } from "react";

const STATS = [
  { valor: "R$ 4,28M", rotulo: "faturamento/mês" },
  { valor: "87%", rotulo: "ocupação média" },
  { valor: "−68%", rotulo: "no-show com IA" },
  { valor: "12min", rotulo: "setup médio" },
];

const RECURSOS = [
  { titulo: "Agenda IA anti no-show", destaque: true },
  { titulo: "WhatsApp integrado" },
  { titulo: "Comissão automática" },
  { titulo: "Pagamento Pix/cartão" },
  { titulo: "Multi-unidade" },
  { titulo: "Clube de assinatura" },
  { titulo: "Portfólio + Marketplace", largo: true },
  { titulo: "Estoque" },
  { titulo: "Relatórios DRE" },
  { titulo: "Fiscal NFS-e" },
];

const PAPEIS = [
  { id: "dono", rotulo: "Dono", href: "/dono", bullets: ["KPIs em tempo real", "Multi-unidade", "Ranking de barbeiros"] },
  { id: "barbeiro", rotulo: "Barbeiro", href: "/barbeiro", bullets: ["Agenda do dia", "Carteira de comissão", "Studio portfólio"] },
  { id: "recepcao", rotulo: "Secretária", href: "/recepcao", bullets: ["Agenda consolidada", "WhatsApp inbox", "Caixa integrado"] },
  { id: "cliente", rotulo: "Cliente", href: "/cliente", bullets: ["Agendar em 3 cliques", "Fidelidade", "Clube do corte"] },
];

const PLANOS = [
  { nome: "Essencial", preco: 97, recursos: ["1 unidade", "Agenda básica", "WhatsApp"] },
  { nome: "Pro", preco: 197, popular: true, recursos: ["3 unidades", "IA anti no-show", "Comissão", "Marketplace"] },
  { nome: "Rede", preco: 397, recursos: ["Ilimitado", "Multi-unidade", "API", "Suporte prioritário"] },
];

export function PaginaLanding() {
  const [papelAtivo, setPapelAtivo] = useState("dono");
  const [anual, setAnual] = useState(false);
  const papel = PAPEIS.find((p) => p.id === papelAtivo)!;

  return (
    <LayoutMarketing>
      <section className="marble-bg relative overflow-hidden px-4 py-16 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-wrap items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-ink-mute">
              Novo · SaaS Brasileiro · 2026
            </p>
            <h1 className="font-serif text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Sua barbearia, <span className="italic text-accent">afiada.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg italic text-ink-soft">
              Agenda, caixa, comissão e WhatsApp — tudo que sua barbearia precisa para crescer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding">
                <Botao tamanho="lg">Testar grátis · 14 dias →</Botao>
              </Link>
              <Link href="/u/navalha-centro/agendar">
                <Botao variante="secundario" tamanho="lg">Ver demo ao vivo</Botao>
              </Link>
            </div>
            <p className="mt-6 font-mono text-xs text-ink-mute">
              Setup 5min · Sem fidelidade · WhatsApp incluso · Suporte humano
            </p>
          </div>
          <div className="relative hidden lg:block">
            <Comanda codigo="#0142" cliente="Ricardo A." servico="Corte + Barba" horario="14:30" valorCentavos={8000} status="Em atendimento" rotacao={-3} className="absolute left-0 top-0 z-10 w-56" />
            <Comanda codigo="#0143" cliente="João M." servico="Visagismo" horario="15:00" valorCentavos={11000} status="Confirmado" rotacao={2} className="absolute left-16 top-16 z-20 w-56" />
            <Comanda codigo="#0144" cliente="Lucas A." servico="Corte simples" horario="16:00" valorCentavos={5000} status="Aguardando" rotacao={-1} className="absolute left-32 top-32 z-30 w-56" />
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-rule bg-bg-soft py-3">
        <div className="animate-[marquee_30s_linear_infinite] whitespace-nowrap font-mono text-xs uppercase tracking-widest text-ink-mute">
          Agenda inteligente · WhatsApp integrado · Comissão automática · Pix instantâneo · Multi-unidade · Clube · Marketplace ·
          Agenda inteligente · WhatsApp integrado · Comissão automática · Pix instantâneo · Multi-unidade · Clube · Marketplace ·
        </div>
      </div>

      <section className="px-4 py-16 md:px-12">
        <div className="mx-auto grid max-w-wrap gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.rotulo} className="text-center">
              <p className="font-serif text-5xl text-accent md:text-6xl">{s.valor}</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-mute">{s.rotulo}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="recursos" className="px-4 py-16 md:px-12">
        <div className="mx-auto max-w-wrap">
          <h2 className="font-serif text-4xl">
            Tudo que sua <span className="italic text-accent">barbearia</span> precisa
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RECURSOS.map((r) => (
              <div
                key={r.titulo}
                className={`rounded-lg border border-rule bg-bg-card p-5 ${r.destaque ? "lg:col-span-2 lg:row-span-2" : ""} ${r.largo ? "lg:col-span-4" : ""}`}
              >
                <h3 className="font-serif text-xl">{r.titulo}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-12">
        <div className="mx-auto max-w-wrap">
          <h2 className="mb-8 font-serif text-4xl">Para cada papel</h2>
          <div className="flex flex-wrap gap-2">
            {PAPEIS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={papelAtivo === p.id}
                onClick={() => setPapelAtivo(p.id)}
                className={`min-h-[44px] rounded-sm px-4 py-2 text-sm ${papelAtivo === p.id ? "bg-accent text-accent-ink" : "border border-rule text-ink-soft"}`}
              >
                {p.rotulo}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-8 rounded-lg border border-rule bg-bg-card p-6 lg:grid-cols-2">
            <ul className="space-y-3">
              {papel.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-ink-soft">
                  <span className="text-accent">→</span> {b}
                </li>
              ))}
              <li className="pt-4">
                <Link href={papel.href} className="text-accent hover:underline">
                  Ver painel {papel.rotulo.toLowerCase()} →
                </Link>
              </li>
            </ul>
            <div className="rounded-lg bg-bg-soft p-4 font-mono text-sm text-ink-mute">
              Preview do painel {papel.rotulo}
            </div>
          </div>
        </div>
      </section>

      <section id="precos" className="px-4 py-16 md:px-12">
        <div className="mx-auto max-w-wrap">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-4xl">Planos</h2>
            <button
              type="button"
              aria-pressed={anual}
              onClick={() => setAnual(!anual)}
              className="rounded-sm border border-rule px-4 py-2 text-sm"
            >
              {anual ? "Anual (−20%)" : "Mensal"}
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANOS.map((plano) => (
              <div
                key={plano.nome}
                className={`rounded-lg border p-6 ${plano.popular ? "border-accent bg-accent/5" : "border-rule bg-bg-card"}`}
              >
                {plano.popular && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Mais popular</span>
                )}
                <h3 className="mt-2 font-serif text-2xl">{plano.nome}</h3>
                <p className="mt-2 font-serif text-4xl text-accent">
                  R$ {anual ? Math.round(plano.preco * 0.8) : plano.preco}
                  <span className="text-base text-ink-mute">/mês</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                  {plano.recursos.map((r) => (
                    <li key={r}>✓ {r}</li>
                  ))}
                </ul>
                <Link href="/onboarding" className="mt-6 block">
                  <Botao variante={plano.popular ? "primario" : "secundario"} className="w-full">
                    Começar
                  </Botao>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-12">
        <div className="mx-auto max-w-wrap">
          <h2 className="mb-6 font-serif text-3xl">FAQ</h2>
          <details className="border-b border-rule py-4">
            <summary className="cursor-pointer font-medium">Preciso de cartão para o trial?</summary>
            <p className="mt-2 text-ink-soft">Não. 14 dias grátis, sem cartão.</p>
          </details>
          <details className="border-b border-rule py-4">
            <summary className="cursor-pointer font-medium">Funciona offline?</summary>
            <p className="mt-2 text-ink-soft">O app do barbeiro funciona como PWA com cache básico.</p>
          </details>
        </div>
      </section>

      <section className="marble-bg px-4 py-20 text-center md:px-12">
        <h2 className="font-serif text-4xl md:text-5xl">
          Pronto para <span className="italic text-accent">afiar</span>?
        </h2>
        <Link href="/onboarding" className="mt-8 inline-block">
          <Botao tamanho="lg">Começar agora →</Botao>
        </Link>
      </section>

      <footer className="border-t border-rule px-4 py-12 md:px-12">
        <DivisorBarbearia />
        <div className="mx-auto flex max-w-wrap flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-serif tracking-widest">NAVALHA</span>
          <p className="font-mono text-xs text-ink-mute">© 2026 Navalha SaaS</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </LayoutMarketing>
  );
}
