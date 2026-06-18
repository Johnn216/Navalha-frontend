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

      {/* Footer Acadêmico */}
      <footer className="border-t border-rule bg-bg-soft">
        <div className="barber-pole" />
        <div className="mx-auto max-w-wrap px-4 py-8 md:px-12">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-left">

            {/* Identidade do Projeto */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-accent font-serif text-lg italic text-accent">
                  N
                </span>
                <span className="font-serif tracking-widest text-ink">NAVALHA</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                Sistema de Gestão para Barbearias
              </p>
            </div>

            {/* Integrantes */}
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                Integrantes
              </p>
              <div className="flex flex-col gap-1.5">
                <div>
                  <p className="text-sm font-medium text-ink">Jhonathan Magalhães da Cruz</p>
                  <p className="font-mono text-[11px] text-ink-mute">RA: 22502908</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Fellipe de Castro Oliveira</p>
                  <p className="font-mono text-[11px] text-ink-mute">RA: 2250324</p>
                </div>
              </div>
            </div>

            {/* Repositórios */}
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                Repositórios
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://github.com/Johnn216/Navalha-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-accent"
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Front-end</span>
                  <svg
                    className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="https://github.com/Johnn216/navalha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-accent"
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Back-end</span>
                  <svg
                    className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Linha de copyright */}
          <div className="mt-8 border-t border-rule pt-6">
            <p className="text-center font-mono text-[10px] uppercase tracking-widest text-ink-mute">
              © {new Date().getFullYear()} Navalha · Trabalho Acadêmico · Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
