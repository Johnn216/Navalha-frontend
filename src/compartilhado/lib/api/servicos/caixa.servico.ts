import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { SessaoCaixa } from "@/compartilhado/tipos/entidades";

export async function abrirSessaoCaixa(dados: {
  unit_id: string;
  opening_float_cents: number;
}) {
  return clienteApi.post<SessaoCaixa>("/cash/sessions/open", dados);
}

export async function obterSessaoCaixaAtual(unit_id: string) {
  return clienteApi.get<SessaoCaixa>("/cash/sessions/current", {
    params: { unit_id },
  });
}

export async function fecharSessaoCaixa(id: string) {
  return clienteApi.post<SessaoCaixa>(`/cash/sessions/${id}/close`);
}
