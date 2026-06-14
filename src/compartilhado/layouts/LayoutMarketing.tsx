"use client";

import Link from "next/link";
import { SeletorTema } from "@/compartilhado/componentes/ui/SeletorTema";
import { useTema } from "@/compartilhado/hooks/useTema";

export function LayoutMarketing({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tema, trocarTema } = useTema();

  return (
    <div className="min-h-screen bg-bg">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b border-rule bg-bg/90 backdrop-blur-md">
        <div className="barber-pole" />
        <div className="mx-auto flex max-w-wrap items-center justify-between gap-4 px-4 py-3 md:px-12">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent font-serif text-xl italic text-accent">
              N
            </span>
            <span className="font-serif text-lg tracking-widest">NAVALHA</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            <Link href="/#recursos" className="px-3 py-2 text-xs uppercase tracking-wider text-ink-soft hover:text-ink">
              Recursos
            </Link>
            <Link href="/#precos" className="px-3 py-2 text-xs uppercase tracking-wider text-ink-soft hover:text-ink">
              Preços
            </Link>
            <Link href="/marketplace" className="px-3 py-2 text-xs uppercase tracking-wider text-ink-soft hover:text-ink">
              Marketplace
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <SeletorTema tema={tema} onTrocar={trocarTema} compacto />
            <Link
              href="/entrar"
              className="hidden text-xs uppercase tracking-wider text-ink-soft hover:text-ink sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/onboarding"
              className="rounded-sm bg-accent px-4 py-2 text-xs font-medium uppercase tracking-wider text-accent-ink"
            >
              Começar →
            </Link>
          </div>
        </div>
      </header>
      <main id="conteudo">{children}</main>
    </div>
  );
}
