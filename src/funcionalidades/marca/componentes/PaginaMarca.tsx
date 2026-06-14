"use client";

import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { Entrada } from "@/compartilhado/componentes/ui/Entrada";
import { Selo } from "@/compartilhado/componentes/ui/Selo";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { Comanda } from "@/compartilhado/componentes/ui/Comanda";
import { SeloKpi } from "@/compartilhado/componentes/ui/SeloKpi";
import { SeletorTema } from "@/compartilhado/componentes/ui/SeletorTema";
import { DivisorBarbearia } from "@/compartilhado/componentes/ui/DivisorBarbearia";
import { SlotHorario } from "@/compartilhado/componentes/ui/SlotHorario";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import { EstadoErro } from "@/compartilhado/componentes/feedback/EstadoErro";
import { EstadoVazio } from "@/compartilhado/componentes/feedback/EstadoVazio";
import { useTema } from "@/compartilhado/hooks/useTema";
import Link from "next/link";

export function PaginaMarca() {
  const { tema, trocarTema } = useTema();

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-rule bg-bg/90 backdrop-blur">
        <div className="barber-pole" />
        <div className="mx-auto flex max-w-wrap items-center justify-between px-4 py-3 md:px-12">
          <span className="font-serif tracking-widest">NAVALHA · Marca</span>
          <SeletorTema tema={tema} onTrocar={trocarTema} />
        </div>
      </header>

      <main className="mx-auto max-w-wrap px-4 py-12 md:px-12">
        <section className="mb-16">
          <Selo variante="accent">Brand Guide · Dev</Selo>
          <h1 className="mt-4 font-serif text-6xl">
            Design <span className="italic text-accent">System</span>
          </h1>
          <p className="mt-4 max-w-lg text-ink-soft">
            Referência interna extraída do handoff. Use os componentes de{" "}
            <code className="text-accent">compartilhado/componentes/ui/</code>.
          </p>
        </section>

        <DivisorBarbearia />

        <section className="my-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl">Tipografia</h2>
            <p className="mt-4 font-serif text-4xl">Cormorant Garamond</p>
            <p className="mt-2 font-sans">Bricolage Grotesque — corpo</p>
            <p className="mt-2 font-mono tabular-nums">JetBrains Mono — KPIs</p>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Temas</h2>
            <p className="mt-2 text-ink-soft">Clássico · Moderno · Terra</p>
          </div>
        </section>

        <section className="my-12">
          <h2 className="mb-6 font-serif text-2xl">Componentes</h2>
          <div className="flex flex-wrap gap-3">
            <Botao>Primário</Botao>
            <Botao variante="secundario">Secundário</Botao>
            <Botao variante="fantasma">Fantasma</Botao>
            <Selo variante="accent">Badge</Selo>
          </div>
          <div className="mt-6 max-w-xs">
            <Entrada rotulo="Campo" placeholder="Placeholder" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <SeloKpi rotulo="Receita" valor="R$ 42,8k" delta="+24%" deltaPositivo />
            <SlotHorario hora="14:30" selecionado />
            <SlotHorario hora="15:00" indisponivel />
          </div>
          <Comanda
            className="mt-6 max-w-xs"
            codigo="#0142"
            cliente="Ricardo"
            servico="Corte + Barba"
            horario="14:30"
            valorCentavos={8000}
          />
        </section>

        <section className="my-12">
          <h2 className="mb-6 font-serif text-2xl">Estados</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Cartao><EstadoCarregando /></Cartao>
            <Cartao><EstadoErro mensagem="Exemplo de erro" /></Cartao>
            <Cartao><EstadoVazio titulo="Vazio" /></Cartao>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-2xl">Telas do produto</h2>
          <div className="flex flex-wrap gap-2">
            {[
              ["/", "Landing"],
              ["/onboarding", "Onboarding"],
              ["/dono", "Dono"],
              ["/recepcao", "Recepção"],
              ["/barbeiro", "Barbeiro"],
              ["/cliente", "Cliente"],
              ["/u/navalha-centro/agendar", "Agendamento"],
              ["/marketplace", "Marketplace"],
            ].map(([href, label]) => (
              <Link key={href} href={href}>
                <Botao variante="secundario" tamanho="sm">{label}</Botao>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
