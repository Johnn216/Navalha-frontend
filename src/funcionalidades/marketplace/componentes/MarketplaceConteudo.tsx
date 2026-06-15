"use client";

import { useQuery } from "@tanstack/react-query";
import { buscarMarketplace } from "@/compartilhado/lib/api/servicos/publico.servico";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import { EstadoErro } from "@/compartilhado/componentes/feedback/EstadoErro";
import { PaginaMarketplace } from "./PaginaMarketplace";

export function MarketplaceConteudo() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketplace"],
    queryFn: () => buscarMarketplace(),
  });

  if (isLoading) return <EstadoCarregando />;
  if (isError) {
    return <EstadoErro onTentarNovamente={() => refetch()} />;
  }

  return <PaginaMarketplace unidades={data?.data ?? []} />;
}
