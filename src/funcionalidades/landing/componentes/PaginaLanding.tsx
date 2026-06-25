"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutMarketing } from "@/compartilhado/layouts/LayoutMarketing";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { DivisorBarbearia } from "@/compartilhado/componentes/ui/DivisorBarbearia";
import { useState } from "react";
import {
  Brain,
  MessageSquare,
  BadgeDollarSign,
  CreditCard,
  Building2,
  Award,
  Store,
  Package,
  BarChart3,
  FileText,
  TrendingUp,
  Users,
  Zap,
  Star,
  Settings,
  Calendar,
  CheckCircle,
  Scissors,
  Smartphone,
  ChevronDown,
  Plus,
} from "lucide-react";

// ── Dados ─────────────────────────────────────────────────────────

const PAPEIS_FAIXA = ["Donos de barbearia", "Barbeiros", "Secretárias", "Clientes"];

const STATS = [
  { valor: "R$ 4,28M", rotulo: "faturamento/mês gerenciado" },
  { valor: "87%", rotulo: "ocupação média" },
  { valor: "−68%", rotulo: "no-show com IA" },
  { valor: "12min", rotulo: "para o setup completo" },
];

const COMO_FUNCIONA = [
  {
    numero: "01",
    titulo: "Dono configura",
    descricao: "Cadastre sua barbearia, barbeiros, serviços e regras de comissão em menos de 12 minutos.",
    icone: Settings,
  },
  {
    numero: "02",
    titulo: "Barbeiros operam",
    descricao: "Agenda do dia, controle de comissão e portfólio — tudo em um painel mobile dedicado.",
    icone: Scissors,
  },
  {
    numero: "03",
    titulo: "Clientes agendam",
    descricao: "Link público único: o cliente escolhe o barbeiro, horário e confirma via WhatsApp em 3 cliques.",
    icone: Smartphone,
  },
];

const RECURSOS = [
  {
    titulo: "Agenda IA anti no-show",
    descricao: "Algoritmo preditivo analisa histórico e envia confirmações automáticas — reduza faltas em até 68%.",
    icone: Brain,
    destaque: true,
    cor: "accent",
  },
  {
    titulo: "WhatsApp integrado",
    descricao: "Inbox unificado com templates automáticos de confirmação e lembrete.",
    icone: MessageSquare,
    cor: "ok",
  },
  {
    titulo: "Comissão automática",
    descricao: "Regras flexíveis por barbeiro, serviço ou combo. Lançamento no fechamento.",
    icone: BadgeDollarSign,
    cor: "warn",
  },
  {
    titulo: "Pagamento Pix/cartão",
    descricao: "QR Code instantâneo ou maquininha integrada com fechamento automático de caixa.",
    icone: CreditCard,
    cor: "accent",
  },
  {
    titulo: "Multi-unidade",
    descricao: "Gerencie várias filiais em um único painel, com métricas comparativas.",
    icone: Building2,
    cor: "ok",
  },
  {
    titulo: "Clube de assinatura",
    descricao: "Recorrência mensal com cartão fidelidade digital e benefícios exclusivos.",
    icone: Award,
    cor: "warn",
  },
  {
    titulo: "Portfólio + Marketplace",
    descricao: "Barbeiros publicam seus trabalhos. Clientes descobrem sua barbearia organicamente.",
    icone: Store,
    largo: true,
    cor: "accent",
  },
  {
    titulo: "Estoque",
    descricao: "Alertas de baixo estoque e custo integrado ao DRE.",
    icone: Package,
    cor: "ok",
  },
  {
    titulo: "Relatórios DRE",
    descricao: "Demonstrativo completo de receitas e despesas por período.",
    icone: BarChart3,
    cor: "warn",
  },
  {
    titulo: "Fiscal NFS-e",
    descricao: "Emissão automática de nota fiscal de serviço no fechamento do atendimento.",
    icone: FileText,
    cor: "accent",
  },
];

const PAPEIS = [
  {
    id: "dono",
    rotulo: "Dono",
    icone: TrendingUp,
    href: "/dono",
    bullets: ["KPIs em tempo real", "Multi-unidade", "Ranking de barbeiros"],
    preview: {
      titulo: "Visão Geral",
      kpis: [
        { rotulo: "Receita", valor: "R$ 4,28M", delta: "+24%" },
        { rotulo: "Ocupação", valor: "87%", delta: "+5%" },
        { rotulo: "Ticket médio", valor: "R$ 78", delta: "+8%" },
        { rotulo: "No-show", valor: "4,2%", delta: "−68%" },
      ],
    },
  },
  {
    id: "barbeiro",
    rotulo: "Barbeiro",
    icone: Zap,
    href: "/barbeiro",
    bullets: ["Agenda do dia", "Carteira de comissão", "Studio portfólio"],
    preview: {
      titulo: "Hoje · Rafael",
      kpis: [
        { rotulo: "Cortes", valor: "8", delta: "hoje" },
        { rotulo: "Comissão", valor: "R$ 256", delta: "+12%" },
        { rotulo: "Próximo", valor: "14:30", delta: "15min" },
        { rotulo: "Ocupação", valor: "92%", delta: "+4%" },
      ],
    },
  },
  {
    id: "recepcao",
    rotulo: "Secretária",
    icone: Users,
    href: "/recepcao",
    bullets: ["Agenda consolidada", "WhatsApp inbox", "Caixa integrado"],
    preview: {
      titulo: "Operação ao vivo",
      kpis: [
        { rotulo: "Em atendimento", valor: "1", delta: "agora" },
        { rotulo: "Na fila", valor: "5", delta: "aguardando" },
        { rotulo: "Caixa", valor: "R$ 840", delta: "aberto" },
        { rotulo: "WhatsApp", valor: "7", delta: "mensagens" },
      ],
    },
  },
  {
    id: "cliente",
    rotulo: "Cliente",
    icone: Star,
    href: "/cliente",
    bullets: ["Agendar em 3 cliques", "Fidelidade digital", "Clube do corte"],
    preview: {
      titulo: "Meu perfil",
      kpis: [
        { rotulo: "Próximo horário", valor: "Sex", delta: "14:30" },
        { rotulo: "Visitas", valor: "14", delta: "meses" },
        { rotulo: "Fidelidade", valor: "8/10", delta: "selos" },
        { rotulo: "Clube", valor: "Ativo", delta: "R$ 99/mês" },
      ],
    },
  },
];

const PLANOS = [
  {
    nome: "Essencial",
    preco: 97,
    recursos: ["1 unidade", "Agenda básica", "WhatsApp", "Pagamentos"],
  },
  {
    nome: "Pro",
    preco: 197,
    popular: true,
    recursos: ["3 unidades", "IA anti no-show", "Comissão automática", "Marketplace", "DRE"],
  },
  {
    nome: "Rede",
    preco: 397,
    recursos: ["Ilimitado", "Multi-unidade", "API pública", "NFS-e automática", "Suporte prioritário"],
  },
];

const DEPOIMENTOS = [
  {
    nome: "Marcos Vinicius",
    role: "Dono · Barbearia Central",
    texto: "Reduzi os no-shows de 18% para menos de 5% em dois meses. O IA é impressionante.",
    estrelas: 5,
  },
  {
    nome: "Juliana Torres",
    role: "Secretária · Studio J",
    texto: "A agenda consolidada salvou minha vida. Antes usava 3 aplicativos. Agora só o Navalha.",
    estrelas: 5,
  },
  {
    nome: "Rafael Santos",
    role: "Barbeiro · Navalha Centro",
    texto: "Minha comissão calculada automaticamente todo mês. Sem discussão, sem erro.",
    estrelas: 5,
  },
];

const FAQ_ITEMS = [
  { q: "Preciso de cartão para o trial?", a: "Não. 14 dias grátis, sem cartão e sem fidelidade. Cancele quando quiser." },
  { q: "Funciona offline?", a: "O app do barbeiro funciona como PWA com cache básico para a agenda do dia." },
  { q: "Como funciona a integração com WhatsApp?", a: "Via WhatsApp Business API oficial. Templates pré-aprovados para confirmação e lembrete." },
  { q: "O Navalha emite nota fiscal?", a: "Sim. NFS-e automática no plano Rede, integrada ao fechamento de cada atendimento." },
  { q: "Posso migrar minha agenda atual?", a: "Oferecemos importação via CSV e suporte de onboarding para migração assistida." },
];

const COR_MAP: Record<string, string> = { accent: "text-accent", ok: "text-ok", warn: "text-warn" };
const BG_MAP: Record<string, string> = { accent: "bg-accent/10", ok: "bg-ok/10", warn: "bg-warn/10" };

// ── Componente ─────────────────────────────────────────────────────

export function PaginaLanding() {
  const [papelAtivo, setPapelAtivo] = useState("dono");
  const [anual, setAnual] = useState(false);
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  const papel = PAPEIS.find((p) => p.id === papelAtivo)!;

  return (
    <LayoutMarketing>

      {/* ── Faixa de contexto ─────────────────────────────────── */}
      <div className="border-b border-rule bg-bg-soft px-4 py-2">
        <div className="mx-auto flex max-w-wrap flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
            Plataforma SaaS para barbearias —
          </span>
          {PAPEIS_FAIXA.map((p, i) => (
            <span key={p} className="flex items-center gap-2 font-mono text-[11px] text-ink-soft">
              {i > 0 && <span className="text-rule">·</span>}
              <CheckCircle className="h-3 w-3 text-accent" />
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">
          {/* Esquerda — Copy */}
          <div className="flex flex-col justify-center px-6 py-20 md:px-16 lg:py-28">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-ink-mute">
              Sistema de gestão · 2026
            </p>
            <h1 className="font-serif text-5xl leading-[0.95] text-ink md:text-6xl lg:text-7xl">
              O sistema que sua{" "}
              <span className="italic text-accent">barbearia</span>{" "}
              precisa para crescer.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              Agenda com IA, caixa, comissão automática e WhatsApp integrado —
              tudo em um lugar só. Setup em 12 minutos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding">
                <Botao tamanho="lg">Testar grátis · 14 dias →</Botao>
              </Link>
              <Link href="/u/navalha-centro/agendar">
                <Botao variante="secundario" tamanho="lg">
                  Ver agendamento do cliente
                </Botao>
              </Link>
            </div>
            <p className="mt-5 font-mono text-xs text-ink-mute">
              Sem cartão · Cancele quando quiser · Suporte humano incluso
            </p>

            {/* Mini stats */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-rule pt-8 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.rotulo}>
                  <p className="font-serif text-2xl text-accent">{s.valor}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                    {s.rotulo}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Direita — Imagem da barbearia */}
          <div className="relative hidden lg:block">
            <Image
              src="/img/hero-barbearia.jpg"
              alt="Interior de barbearia premium gerenciada pelo Navalha"
              fill
              className="object-cover"
              priority
            />
            {/* Gradiente de transição */}
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/20 to-transparent" />
            {/* Badge flutuante */}
            <div className="absolute bottom-8 right-8 rounded-xl border border-accent/30 bg-bg/90 p-4 backdrop-blur-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">IA ativa agora</p>
              <p className="mt-1 font-serif text-xl text-accent">4,2% no-show</p>
              <p className="font-mono text-xs text-ok">vs 18% sem o Navalha</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-rule bg-bg-soft py-3">
        <div
          className="whitespace-nowrap font-mono text-xs uppercase tracking-widest text-ink-mute"
          style={{ animation: "marquee 30s linear infinite" }}
        >
          Barbearia · Agenda IA · WhatsApp · Comissão automática · Pix instantâneo ·
          Multi-unidade · Clube de assinatura · Marketplace · Estoque · NFS-e ·
          Barbearia · Agenda IA · WhatsApp · Comissão automática · Pix instantâneo ·
          Multi-unidade · Clube de assinatura · Marketplace · Estoque · NFS-e ·
        </div>
      </div>

      {/* ── Como funciona ─────────────────────────────────────── */}
      <section className="px-4 py-20 md:px-12">
        <div className="mx-auto max-w-wrap">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">
            Como funciona
          </p>
          <h2 className="font-serif text-4xl">
            Pronto em <span className="italic text-accent">3 passos</span>
          </h2>
          <p className="mt-3 max-w-xl text-ink-soft">
            Do zero ao funcionamento completo em menos de uma tarde.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {COMO_FUNCIONA.map((passo, idx) => {
              const Icone = passo.icone;
              return (
                <div key={passo.numero} className="relative">
                  {/* Conector entre passos */}
                  {idx < COMO_FUNCIONA.length - 1 && (
                    <div className="absolute left-full top-8 hidden h-px w-full -translate-y-1/2 border-t border-dashed border-rule md:block" style={{ width: "calc(100% - 2rem)", left: "calc(100% + 1rem)" }} />
                  )}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10">
                    <Icone className="h-7 w-7 text-accent" />
                  </div>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                    Passo {passo.numero}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-ink">{passo.titulo}</h3>
                  <p className="mt-2 text-ink-soft">{passo.descricao}</p>
                </div>
              );
            })}
          </div>

          {/* Imagem de ambientação */}
          <div className="mt-14 overflow-hidden rounded-2xl border border-rule">
            <div className="relative h-64 md:h-96">
              <Image
                src="/img/barbeiro-atendimento.jpg"
                alt="Barbeiro atendendo cliente com precisão — barbearia gerenciada pelo Navalha"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="font-serif text-2xl text-ink">
                  Navalha Centro — 87% de ocupação este mês
                </p>
                <p className="mt-1 font-mono text-sm text-ink-soft">
                  Gerenciado com Navalha Pro desde 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recursos — Bento Grid ─────────────────────────────── */}
      <section id="recursos" className="bg-bg-soft px-4 py-20 md:px-12">
        <div className="mx-auto max-w-wrap">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">
            Funcionalidades
          </p>
          <h2 className="font-serif text-4xl">
            Tudo que sua <span className="italic text-accent">barbearia</span> precisa
          </h2>
          <p className="mt-3 max-w-xl text-ink-soft">
            Uma plataforma completa, construída para o ritmo real de uma barbearia profissional.
          </p>

          <div className="mt-10 grid auto-rows-[minmax(140px,auto)] gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RECURSOS.map((r) => {
              const Icone = r.icone;
              const corTexto = COR_MAP[r.cor] ?? "text-accent";
              const corBg = BG_MAP[r.cor] ?? "bg-accent/10";
              return (
                <div
                  key={r.titulo}
                  className={[
                    "group relative overflow-hidden rounded-xl border border-rule bg-bg-card p-5 transition-all duration-300",
                    "hover:border-accent/30 hover:-translate-y-0.5",
                    "hover:shadow-[0_4px_24px_color-mix(in_oklab,var(--accent)_8%,transparent)]",
                    r.destaque ? "lg:col-span-2 lg:row-span-2" : "",
                    r.largo && !r.destaque ? "sm:col-span-2 lg:col-span-2" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {r.destaque && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
                  )}
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${corBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icone className={`h-5 w-5 ${corTexto}`} />
                  </div>
                  <h3 className={`font-serif ${r.destaque ? "text-2xl" : "text-lg"} leading-tight text-ink`}>
                    {r.titulo}
                  </h3>
                  <p className={`mt-2 text-ink-soft ${r.destaque ? "text-base" : "text-sm"} leading-relaxed`}>
                    {r.descricao}
                  </p>
                  {r.destaque && (
                    <div className="mt-4 flex items-center gap-2 font-mono text-xs text-accent">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                      <span>IA ativa em tempo real</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Para cada papel ───────────────────────────────────── */}
      <section className="px-4 py-20 md:px-12">
        <div className="mx-auto max-w-wrap">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">
            Painéis especializados
          </p>
          <h2 className="mb-8 font-serif text-4xl">
            Para cada <span className="italic text-accent">papel</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {PAPEIS.map((p) => {
              const Icone = p.icone;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={papelAtivo === p.id}
                  onClick={() => setPapelAtivo(p.id)}
                  className={`flex min-h-[44px] items-center gap-2 rounded-sm px-4 py-2 text-sm transition-all ${
                    papelAtivo === p.id
                      ? "bg-accent text-accent-ink shadow-[0_2px_12px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
                      : "border border-rule text-ink-soft hover:border-accent/40 hover:text-ink"
                  }`}
                >
                  <Icone className="h-3.5 w-3.5" />
                  {p.rotulo}
                </button>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-rule bg-bg-card">
            <div className="grid lg:grid-cols-2">
              <div className="p-6 lg:border-r lg:border-rule">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-accent">
                  Painel {papel.rotulo}
                </p>
                <ul className="space-y-3">
                  {papel.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-ink-soft">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href={papel.href} className="mt-6 inline-block">
                  <Botao tamanho="sm">Abrir painel {papel.rotulo.toLowerCase()} →</Botao>
                </Link>
              </div>
              <div className="bg-bg-soft p-6">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                  {papel.preview.titulo}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {papel.preview.kpis.map((kpi) => (
                    <div key={kpi.rotulo} className="rounded-lg border border-rule bg-bg-card p-3">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{kpi.rotulo}</p>
                      <p className="mt-1 font-serif text-2xl text-ink">{kpi.valor}</p>
                      <p className="font-mono text-xs text-accent">{kpi.delta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Depoimentos ───────────────────────────────────────── */}
      <section className="bg-bg-soft px-4 py-20 md:px-12">
        <div className="mx-auto max-w-wrap">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">Clientes</p>
          <h2 className="mb-8 font-serif text-4xl">
            Quem já <span className="italic text-accent">afiou</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {DEPOIMENTOS.map((d) => (
              <div key={d.nome} className="rounded-xl border border-rule bg-bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/30">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: d.estrelas }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm italic text-ink-soft">"{d.texto}"</p>
                <div className="mt-4 border-t border-rule pt-3">
                  <p className="text-sm font-medium text-ink">{d.nome}</p>
                  <p className="font-mono text-[11px] text-ink-mute">{d.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planos ────────────────────────────────────────────── */}
      <section id="precos" className="px-4 py-20 md:px-12">
        <div className="mx-auto max-w-wrap">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">Preços</p>
              <h2 className="font-serif text-4xl">Planos</h2>
            </div>
            <button
              type="button"
              aria-pressed={anual}
              onClick={() => setAnual(!anual)}
              className={`flex items-center gap-2 rounded-sm border px-4 py-2 text-sm transition-colors ${
                anual ? "border-accent bg-accent/10 text-accent" : "border-rule text-ink-soft hover:border-accent/40"
              }`}
            >
              {anual ? "✓ Anual (−20%)" : "Mensal"}
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANOS.map((plano) => (
              <div
                key={plano.nome}
                className={`relative rounded-xl border p-6 transition-all hover:-translate-y-0.5 ${
                  plano.popular
                    ? "border-accent bg-bg-card shadow-[0_0_40px_color-mix(in_oklab,var(--accent)_12%,transparent)]"
                    : "border-rule bg-bg-card"
                }`}
              >
                {plano.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-ink">
                      Mais popular
                    </span>
                  </div>
                )}
                <h3 className="mt-2 font-serif text-2xl text-ink">{plano.nome}</h3>
                <p className="mt-3 font-serif text-4xl text-accent">
                  R$ {anual ? Math.round(plano.preco * 0.8) : plano.preco}
                  <span className="text-base text-ink-mute">/mês</span>
                </p>
                {anual && (
                  <p className="mt-1 font-mono text-xs text-ok">
                    Economize R$ {Math.round(plano.preco * 0.2 * 12)}/ano
                  </p>
                )}
                <ul className="mt-5 space-y-2">
                  {plano.recursos.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm text-ink-soft">
                      <span className="text-accent">✓</span> {r}
                    </li>
                  ))}
                </ul>
                <Link href="/onboarding" className="mt-6 block">
                  <Botao variante={plano.popular ? "primario" : "secundario"} className="w-full">
                    Começar agora
                  </Botao>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="bg-bg-soft px-4 py-20 md:px-12">
        <div className="mx-auto max-w-wrap">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">Dúvidas</p>
          <h2 className="mb-8 font-serif text-3xl">FAQ</h2>
          <div className="divide-y divide-rule rounded-xl border border-rule">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFaqAberto(faqAberto === idx ? null : idx)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-bg"
                >
                  <span className="font-medium text-ink">{item.q}</span>
                  <ChevronDown
                    className={`ml-4 h-4 w-4 shrink-0 text-accent transition-transform duration-300 ${
                      faqAberto === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {faqAberto === idx && (
                  <div className="border-t border-rule bg-bg px-5 pb-4 pt-3">
                    <p className="text-ink-soft">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ─────────────────────────────────────────── */}
      <section className="px-4 py-24 text-center md:px-12">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">Comece hoje</p>
        <h2 className="font-serif text-4xl md:text-5xl">
          Pronto para <span className="italic text-accent">afiar</span> sua barbearia?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          14 dias grátis. Sem cartão. Cancele quando quiser. Setup em 12 minutos.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/onboarding">
            <Botao tamanho="lg">Começar agora →</Botao>
          </Link>
          <Link href="/u/navalha-centro/agendar">
            <Botao variante="secundario" tamanho="lg">Ver agendamento do cliente</Botao>
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-rule px-4 py-12 md:px-12">
        <DivisorBarbearia />
        <div className="mx-auto flex max-w-wrap flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-serif tracking-widest">NAVALHA</span>
          <p className="font-mono text-xs text-ink-mute">© 2026 Navalha SaaS · Sistema de Gestão para Barbearias</p>
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
