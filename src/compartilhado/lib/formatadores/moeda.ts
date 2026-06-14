export function formatarBRL(centavos: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centavos / 100);
}

export function formatarBRLCompacto(centavos: number): string {
  const reais = centavos / 100;
  if (reais >= 1000) {
    return `R$ ${(reais / 1000).toFixed(1).replace(".", ",")}k`;
  }
  return formatarBRL(centavos);
}
