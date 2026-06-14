"use client";

import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { Selo } from "@/compartilhado/componentes/ui/Selo";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { EstadoCarregando } from "@/compartilhado/componentes/feedback/EstadoCarregando";
import { EstadoVazio } from "@/compartilhado/componentes/feedback/EstadoVazio";
import { formatarDataHora } from "@/compartilhado/lib/formatadores/data-hora";
import type { MensagemWhatsApp } from "@/compartilhado/tipos/entidades";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enviarWhatsApp } from "@/compartilhado/lib/api/servicos/notificacoes.servico";
import { chavesConsultaRecepcao } from "@/funcionalidades/recepcao/hooks/useRecepcao";
import { useUnidadeAtiva } from "@/compartilhado/hooks/useUnidadeAtiva";

export function InboxWhatsApp({
  mensagens,
  carregando,
}: {
  mensagens: MensagemWhatsApp[];
  carregando?: boolean;
}) {
  const { unidadeId } = useUnidadeAtiva();
  const qc = useQueryClient();
  const enviar = useMutation({
    mutationFn: enviarWhatsApp,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: chavesConsultaRecepcao.whatsapp(unidadeId) }),
  });

  if (carregando) return <EstadoCarregando />;
  if (!mensagens.length) return <EstadoVazio titulo="Inbox vazio" descricao="Nenhuma mensagem WhatsApp" />;

  return (
    <Cartao titulo="WhatsApp Inbox">
      <div className="max-h-80 space-y-3 overflow-y-auto">
        {mensagens.map((m) => (
          <div
            key={m.id}
            className={`rounded-sm p-3 ${m.direction === "IN" ? "bg-bg-soft" : "bg-accent/10 ml-8"}`}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">{m.client?.name}</span>
              <Selo variante={m.status === "READ" ? "ok" : "padrao"}>{m.status}</Selo>
            </div>
            <p className="text-sm">{m.body}</p>
            <p className="mt-1 font-mono text-[10px] text-ink-mute">
              {formatarDataHora(m.created_at)}
            </p>
          </div>
        ))}
      </div>
      <Botao
        variante="secundario"
        className="mt-4 w-full"
        onClick={() =>
          enviar.mutate({
            client_id: mensagens[0]?.client_id ?? "",
            body: "Confirma seu horário?",
            template: "confirmacao",
          })
        }
      >
        Enviar confirmação
      </Botao>
    </Cartao>
  );
}
