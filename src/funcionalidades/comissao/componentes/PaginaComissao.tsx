"use client";

import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { formatarBRL } from "@/compartilhado/lib/formatadores/moeda";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  listarRegrasComissao,
  listarLancamentosComissao,
  exportarComissao,
} from "@/compartilhado/lib/api/servicos/comissao.servico";
import { LayoutApp } from "@/compartilhado/layouts/LayoutApp";

export function PaginaComissao() {
  const regras = useQuery({
    queryKey: ["comissao", "regras"],
    queryFn: listarRegrasComissao,
  });
  const lancamentos = useQuery({
    queryKey: ["comissao", "lancamentos"],
    queryFn: () =>
      listarLancamentosComissao({ barber_id: "barber-rafael", period: "2026-06" }),
  });
  const exportar = useMutation({ mutationFn: exportarComissao });

  return (
    <LayoutApp
      itensNav={[
        { href: "/dono/comissao", rotulo: "Comissão" },
        { href: "/dono", rotulo: "← Visão geral" },
      ]}
      titulo="Comissão"
    >
      <Cartao titulo="Regras ativas" className="mb-6">
        {regras.data?.map((r) => (
          <div key={r.id} className="flex justify-between border-b border-rule py-3">
            <span>{r.scope} · {r.type}</span>
            <span className="font-mono">{typeof r.value === "number" ? `${r.value}%` : "Tabela"}</span>
          </div>
        ))}
      </Cartao>

      <Cartao titulo="Lançamentos · Rafael Santos">
        {lancamentos.data?.data.map((l) => (
          <div key={l.id} className="flex justify-between border-b border-rule py-3">
            <span>{l.period}</span>
            <span className="font-mono">{formatarBRL(l.amount_cents)}</span>
          </div>
        ))}
        <Botao
          variante="secundario"
          className="mt-4"
          onClick={() =>
            exportar.mutate({ barber_id: "barber-rafael", period: "2026-06" })
          }
        >
          Exportar PDF
        </Botao>
      </Cartao>
    </LayoutApp>
  );
}
