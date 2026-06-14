"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, Scissors, User, Wallet } from "lucide-react";

import { cn } from "@/compartilhado/lib/utilitarios/cn";

const ABAS_BARBEIRO = [
  { id: "hoje", rotulo: "Hoje", icone: Home, segmento: "" },
  { id: "agenda", rotulo: "Agenda", icone: Calendar, segmento: "/agenda" },
  { id: "clientes", rotulo: "Clientes", icone: User, segmento: "/clientes" },
  { id: "carteira", rotulo: "Carteira", icone: Wallet, segmento: "/carteira" },
  { id: "studio", rotulo: "Studio", icone: Scissors, segmento: "/studio" },
];

const ABAS_CLIENTE = [
  { id: "inicio", rotulo: "Início", icone: Home, segmento: "" },
  { id: "agendar", rotulo: "Agendar", icone: Calendar, segmento: "/agendar" },
  { id: "historico", rotulo: "Histórico", icone: User, segmento: "/historico" },
  { id: "clube", rotulo: "Clube", icone: Wallet, segmento: "/clube" },
];

export function BarraAbasMobile({
  prefixo = "/barbeiro",
}: {
  prefixo?: "/barbeiro" | "/cliente";
}) {
  const pathname = usePathname();
  const abas = prefixo === "/cliente" ? ABAS_CLIENTE : ABAS_BARBEIRO;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-bg-soft/95 backdrop-blur-md"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto flex max-w-lg">
        {abas.map((aba) => {
          const href = `${prefixo}${aba.segmento}`;
          const ativo =
            aba.segmento === ""
              ? pathname === prefixo || pathname === `${prefixo}/`
              : pathname.startsWith(href);
          const Icone = aba.icone;

          return (
            <li key={aba.id} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-[10px] uppercase tracking-wide",
                  ativo ? "text-accent" : "text-ink-mute",
                )}
                aria-current={ativo ? "page" : undefined}
              >
                <Icone className="h-5 w-5" aria-hidden />
                {aba.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
