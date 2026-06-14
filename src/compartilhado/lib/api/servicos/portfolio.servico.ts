import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { PostPortfolio } from "@/compartilhado/tipos/entidades";

export async function listarPortfolio(barberId: string) {
  return clienteApi.get<PostPortfolio[]>(`/barbers/${barberId}/portfolio`);
}

export async function publicarPortfolio(
  barberId: string,
  dados: { image_url: string; caption: string; service_id?: string }
) {
  return clienteApi.post<PostPortfolio>(`/barbers/${barberId}/portfolio`, dados);
}

export async function criarAvaliacao(dados: {
  barber_id?: string;
  unit_id?: string;
  rating: number;
  comment?: string;
}) {
  return clienteApi.post("/reviews", dados);
}
