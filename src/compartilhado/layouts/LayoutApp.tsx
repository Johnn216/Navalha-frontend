"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SeletorTema } from "@/compartilhado/componentes/ui/SeletorTema";
import { useTema } from "@/compartilhado/hooks/useTema";
import { useSessao } from "@/funcionalidades/autenticacao/hooks/useSessao";
import { cn } from "@/compartilhado/lib/utilitarios/cn";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

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
  const { usuario } = useSessao();
  const [menuAberto, setMenuAberto] = useState(false);

  const iniciais = usuario?.name
    ? usuario.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";
  const primeiroNome = usuario?.name?.split(" ")[0] ?? "Usuário";

  const roleBadge: Record<string, string> = {
    OWNER: "Dono",
    RECEPTION: "Recepção",
    BARBER: "Barbeiro",
    CLIENT: "Cliente",
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="border-b border-rule p-5">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setMenuAberto(false)}
        >
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

      {/* Navegação */}
      <nav className="flex-1 p-3" aria-label="Navegação lateral">
        {itensNav.map((item) => {
          const ativo = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={ativo ? "page" : undefined}
              onClick={() => setMenuAberto(false)}
              className={cn(
                "mb-1 flex min-h-[44px] items-center justify-between rounded-sm px-3 py-2 text-sm transition-all duration-150",
                ativo
                  ? "border-l-2 border-accent bg-accent/10 font-medium text-accent"
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

      {/* Footer da sidebar: usuário + tema */}
      <div className="border-t border-rule p-4">
        {usuario && (
          <div className="mb-3 flex items-center gap-3 rounded-sm border border-rule bg-bg-elev px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 font-serif text-sm font-medium text-accent">
              {iniciais}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {primeiroNome}
              </p>
              <p className="font-mono text-[10px] text-ink-mute">
                {roleBadge[usuario.role ?? ""] ?? usuario.role}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <SeletorTema tema={tema} onTrocar={trocarTema} compacto />
          <Link
            href="/entrar"
            className="flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[11px] text-ink-mute transition-colors hover:text-danger"
            title="Sair"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sair</span>
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-bg">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>

      {/* Sidebar desktop */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-rule bg-bg-soft lg:flex">
        <SidebarContent />
      </aside>

      {/* Drawer mobile overlay */}
      {menuAberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuAberto(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-rule bg-bg-soft">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Área principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="relative flex items-center justify-between border-b border-rule px-4 py-3 lg:px-8">
          <div className="barber-pole absolute left-0 right-0 top-0 h-[3px]" />

          {/* Mobile: botão hamburguer + título */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMenuAberto(true)}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-rule text-ink-soft hover:text-ink"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="font-serif text-lg">{titulo}</h1>
          </div>

          {/* Desktop: área vazia à esquerda (título está na sidebar) */}
          <div className="hidden lg:block" />

          {/* Direita: tema + info usuário */}
          <div className="flex items-center gap-3">
            <SeletorTema tema={tema} onTrocar={trocarTema} compacto />
            {usuario && (
              <div className="hidden items-center gap-2 lg:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 font-serif text-xs font-medium text-accent">
                  {iniciais}
                </div>
                <span className="font-mono text-xs text-ink-mute">
                  {primeiroNome}
                </span>
              </div>
            )}
          </div>
        </header>

        <main id="conteudo" className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
