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
import { listarBarbeiros } from "@/compartilhado/lib/api/servicos/barbeiros.servico";
import { LayoutApp } from "@/compartilhado/layouts/LayoutApp";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import { EstadoVazio } from "@/compartilhado/componentes/feedback/EstadoVazio";
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";

const PERIODO_ATUAL = "2026-06";

export function PaginaComissao() {
  const { unidadeId } = useUnidadeAtiva();

  const barbeiros = useQuery({
    queryKey: ["comissao", "barbeiros", unidadeId],
    queryFn: () => listarBarbeiros(unidadeId),
    enabled: !!unidadeId,
  });

  const barbeiroId = barbeiros.data?.[0]?.id;

  const regras = useQuery({
    queryKey: ["comissao", "regras"],
    queryFn: listarRegrasComissao,
  });
  const lancamentos = useQuery({
    queryKey: ["comissao", "lancamentos", barbeiroId],
    queryFn: () =>
      listarLancamentosComissao({ barber_id: barbeiroId!, period: PERIODO_ATUAL }),
    enabled: !!barbeiroId,
  });
  const exportar = useMutation({ mutationFn: exportarComissao });

  const carregando = regras.isLoading || barbeiros.isLoading || lancamentos.isLoading;
  const erro = regras.isError || barbeiros.isError || lancamentos.isError;

  if (carregando) return <EstadoCarregando />;
  if (erro) {
    return (
      <LayoutApp
        itensNav={[
          { href: "/dono/comissao", rotulo: "Comissão" },
          { href: "/dono", rotulo: "← Visão geral" },
        ]}
        titulo="Comissão"
      >
        <EstadoVazio
          titulo="Em breve"
          descricao="O módulo de comissão estará disponível quando o backend implementar esta funcionalidade."
        />
      </LayoutApp>
    );
  }

  const nomeBarbeiro = barbeiros.data?.[0]?.display_name ?? "Barbeiro";

  return (
    <LayoutApp
      itensNav={[
        { href: "/dono/comissao", rotulo: "Comissão" },
        { href: "/dono", rotulo: "← Visão geral" },
      ]}
      titulo="Comissão"
    >
      <Cartao titulo="Regras ativas" className="mb-6">
        {regras.data?.length ? (
          regras.data.map((r) => (
            <div key={r.id} className="flex justify-between border-b border-rule py-3">
              <span>{r.scope} · {r.type}</span>
              <span className="font-mono">{typeof r.value === "number" ? `${r.value}%` : "Tabela"}</span>
            </div>
          ))
        ) : (
          <p className="text-ink-soft">Nenhuma regra cadastrada.</p>
        )}
      </Cartao>

      <Cartao titulo={`Lançamentos · ${nomeBarbeiro}`}>
        {lancamentos.data?.data?.length ? (
          lancamentos.data.data.map((l) => (
            <div key={l.id} className="flex justify-between border-b border-rule py-3">
              <span>{l.period}</span>
              <span className="font-mono">{formatarBRL(l.amount_cents)}</span>
            </div>
          ))
        ) : (
          <p className="text-ink-soft">Sem lançamentos neste período.</p>
        )}
        {barbeiroId && (
          <Botao
            variante="secundario"
            className="mt-4"
            onClick={() =>
              exportar.mutate({ barber_id: barbeiroId, period: PERIODO_ATUAL })
            }
          >
            Exportar PDF
          </Botao>
        )}
      </Cartao>
    </LayoutApp>
  );
}
