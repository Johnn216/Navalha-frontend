import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { Produto } from "@/compartilhado/tipos/entidades";

export async function listarProdutos(unit_id: string) {
  return clienteApi.get<Produto[]>("/products", { params: { unit_id } });
}

export async function criarProduto(dados: Partial<Produto>) {
  return clienteApi.post<Produto>("/products", dados);
}

export async function atualizarProduto(id: string, dados: Partial<Produto>) {
  return clienteApi.patch<Produto>(`/products/${id}`, dados);
}
