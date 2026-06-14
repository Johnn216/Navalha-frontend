import { marketplaceUnidades } from "@/compartilhado/mocks/dados-sementes";
import { PaginaMarketplace } from "@/funcionalidades/marketplace";

export const dynamic = "force-static";

export default async function MarketplacePage() {
  const usarMocks = process.env.NEXT_PUBLIC_USAR_MOCKS === "true";

  if (usarMocks) {
    return <PaginaMarketplace unidades={marketplaceUnidades} />;
  }

  const { buscarMarketplace } = await import(
    "@/compartilhado/lib/api/servicos/publico.servico"
  );
  const resultado = await buscarMarketplace();
  return <PaginaMarketplace unidades={resultado.data} />;
}
