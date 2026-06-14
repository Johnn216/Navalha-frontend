"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/compartilhado/lib/utilitarios/cn";
import type { LucideIcon } from "lucide-react";

export interface AbaMobile {
  href: string;
  rotulo: string;
  icone: LucideIcon;
}

export function LayoutMobile({
  children,
  abas,
  titulo,
}: {
  children: React.ReactNode;
  abas: AbaMobile[];
  titulo?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-bg pb-20">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-30 border-b border-rule bg-bg/95 px-4 py-3 backdrop-blur">
        <div className="barber-pole mb-2" />
        <h1 className="font-serif text-xl">{titulo ?? "Navalha"}</h1>
      </header>
      <main id="conteudo" className="flex-1 px-4 py-4">
        {children}
      </main>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-rule bg-bg-elev"
        aria-label="Navegação principal"
      >
        <div className="mx-auto flex max-w-lg">
          {abas.map(({ href, rotulo, icone: Icone }) => {
            const ativo = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[10px]",
                  ativo ? "text-accent" : "text-ink-mute"
                )}
              >
                <Icone className="h-5 w-5" aria-hidden />
                {rotulo}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
