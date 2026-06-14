import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { Pagamento, MetodoPagamento } from "@/compartilhado/tipos/entidades";

export async function registrarPagamento(dados: {
  appointment_id?: string;
  method: MetodoPagamento;
  amount_cents: number;
  change_cents?: number;
}) {
  return clienteApi.post<Pagamento>("/payments", dados);
}

export async function criarIntentPix(dados: {
  appointment_id?: string;
  amount_cents: number;
}) {
  return clienteApi.post<{ qr_code: string; intent_id: string }>(
    "/payments/pix/intent",
    dados
  );
}
