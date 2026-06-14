"use client";

import Link from "next/link";
import { LayoutMarketing } from "@/compartilhado/layouts/LayoutMarketing";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import type { PerfilPublicoUnidade } from "@/compartilhado/tipos/entidades";

export function PaginaMarketplace({
  unidades,
}: {
  unidades: PerfilPublicoUnidade[];
}) {
  return (
    <LayoutMarketing>
      <section className="px-4 py-16 md:px-12">
        <div className="mx-auto max-w-wrap">
          <h1 className="font-serif text-5xl">
            Marketplace <span className="italic text-accent">Navalha</span>
          </h1>
          <p className="mt-4 max-w-xl text-ink-soft">
            Encontre barbearias perto de você. Agende sem cadastro.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {unidades.map((u) => (
              <Cartao key={u.id}>
                <h2 className="font-serif text-2xl">{u.name}</h2>
                <p className="text-ink-mute">{u.city} · ★ {u.rating_avg}</p>
                <p className="mt-2 text-sm text-ink-soft">
                  {u.barbers.length} barbeiros · {u.services.length} serviços
                </p>
                <Link
                  href={`/u/${u.slug}/agendar`}
                  className="mt-4 inline-block text-accent hover:underline"
                >
                  Agendar →
                </Link>
              </Cartao>
            ))}
          </div>
        </div>
      </section>
    </LayoutMarketing>
  );
}
