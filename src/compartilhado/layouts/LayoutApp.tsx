"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SeletorTema } from "@/compartilhado/componentes/ui/SeletorTema";
import { useTema } from "@/compartilhado/hooks/useTema";
import { cn } from "@/compartilhado/lib/utilitarios/cn";

export interface ItemNav {
  href: string;
  rotulo: string;
  badge?: number;
}

export function LayoutApp({
  children,
  itensNav,
  titulo,
}: {
  children: React.ReactNode;
  itensNav: ItemNav[];
  titulo?: string;
}) {
  const pathname = usePathname();
  const { tema, trocarTema } = useTema();

  return (
    <div className="flex min-h-screen bg-bg">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <aside className="hidden w-60 shrink-0 flex-col border-r border-rule bg-bg-soft lg:flex">
        <div className="border-b border-rule p-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent font-serif italic text-accent">
              N
            </span>
            <span className="font-serif tracking-widest">NAVALHA</span>
          </Link>
          {titulo && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
              {titulo}
            </p>
          )}
        </div>
        <nav className="flex-1 p-3" aria-label="Navegação lateral">
          {itensNav.map((item) => {
            const ativo = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "mb-1 flex min-h-[44px] items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors",
                  ativo
                    ? "border-l-2 border-accent bg-accent/10 text-accent"
                    : "text-ink-soft hover:bg-bg-elev hover:text-ink"
                )}
              >
                {item.rotulo}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] text-accent-ink">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-rule p-4">
          <SeletorTema tema={tema} onTrocar={trocarTema} compacto />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-rule px-4 py-3 lg:px-8">
          <div className="barber-pole absolute left-0 right-0 top-0 hidden h-[3px] lg:block" />
          <h1 className="font-serif text-xl lg:hidden">{titulo}</h1>
          <SeletorTema tema={tema} onTrocar={trocarTema} compacto />
        </header>
        <main id="conteudo" className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
