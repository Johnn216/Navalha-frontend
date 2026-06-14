import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { MensagemWhatsApp } from "@/compartilhado/tipos/entidades";

export async function listarInboxWhatsApp(unit_id: string) {
  return clienteApi.get<MensagemWhatsApp[]>("/whatsapp/inbox", {
    params: { unit_id },
  });
}

export async function enviarWhatsApp(dados: {
  client_id: string;
  template?: string;
  body: string;
  appointment_id?: string;
}) {
  return clienteApi.post("/whatsapp/send", dados);
}

export async function listarNotificacoes() {
  return clienteApi.get<{ id: string; title: string; read: boolean }[]>(
    "/notifications"
  );
}
