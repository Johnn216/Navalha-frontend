import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type {
  RegraComissao,
  LancamentoComissao,
} from "@/compartilhado/tipos/entidades";
import type { RespostaPaginada } from "@/compartilhado/tipos/api";

export async function listarRegrasComissao() {
  return clienteApi.get<RegraComissao[]>("/commission/rules");
}

export async function criarRegraComissao(dados: Partial<RegraComissao>) {
  return clienteApi.post<RegraComissao>("/commission/rules", dados);
}

export async function atualizarRegraComissao(
  id: string,
  dados: Partial<RegraComissao>
) {
  return clienteApi.patch<RegraComissao>(`/commission/rules/${id}`, dados);
}

export async function listarLancamentosComissao(params: {
  barber_id: string;
  period: string;
}) {
  return clienteApi.get<RespostaPaginada<LancamentoComissao>>(
    "/commission/entries",
    { params }
  );
}

export async function exportarComissao(params: {
  barber_id: string;
  period: string;
}) {
  return clienteApi.get<{ pdf_url: string }>("/commission/entries/export", {
    params,
  });
}
