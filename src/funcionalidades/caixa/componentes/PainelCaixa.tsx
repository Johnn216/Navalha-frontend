"use client";

import { useState } from "react";
import { Cartao } from "@/compartilhado/componentes/ui/Cartao";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import { Entrada } from "@/compartilhado/componentes/ui/Entrada";
import { formatarBRL } from "@/compartilhado/lib/formatadores/moeda";
import type { SessaoCaixa } from "@/compartilhado/tipos/entidades";
import { useMutation } from "@tanstack/react-query";
import {
  registrarPagamento,
  criarIntentPix,
} from "@/compartilhado/lib/api/servicos/pagamentos.servico";
import { fecharSessaoCaixa } from "@/compartilhado/lib/api/servicos/caixa.servico";
import type { MetodoPagamento } from "@/compartilhado/tipos/entidades";

export function PainelCaixa({ sessao }: { sessao?: SessaoCaixa | null }) {
  const [metodo, setMetodo] = useState<MetodoPagamento>("PIX");
  const [valor, setValor] = useState("8000");
  const [troco, setTroco] = useState("0");
  const [qrPix, setQrPix] = useState<string | null>(null);

  const pagamento = useMutation({ mutationFn: registrarPagamento });
  const pix = useMutation({
    mutationFn: criarIntentPix,
    onSuccess: (d) => setQrPix(d.qr_code),
  });
  const fechar = useMutation({ mutationFn: () => fecharSessaoCaixa(sessao?.id ?? "") });

  return (
    <Cartao titulo="Caixa do dia">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="font-mono text-xs text-ink-mute">Fundo de troco</p>
          <p className="font-serif text-2xl">{formatarBRL(sessao?.opening_float_cents ?? 20000)}</p>
        </div>
        <div>
          <p className="font-mono text-xs text-ink-mute">Esperado</p>
          <p className="font-serif text-2xl text-accent">{formatarBRL(sessao?.expected_cents ?? 84000)}</p>
        </div>
        <div>
          <p className="font-mono text-xs text-ink-mute">Status</p>
          <p className="font-mono text-sm uppercase">{sessao?.status ?? "OPEN"}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {(["PIX", "CARD", "CASH"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={metodo === m}
            onClick={() => setMetodo(m)}
            className={`min-h-[44px] flex-1 rounded-sm text-sm ${metodo === m ? "bg-accent text-accent-ink" : "border border-rule"}`}
          >
            {m === "PIX" ? "Pix" : m === "CARD" ? "Cartão" : "Dinheiro"}
          </button>
        ))}
      </div>

      <Entrada rotulo="Valor (centavos)" value={valor} onChange={(e) => setValor(e.target.value)} />
      {metodo === "CASH" && (
        <Entrada rotulo="Troco (centavos)" value={troco} onChange={(e) => setTroco(e.target.value)} className="mt-3" />
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Botao
          onClick={() => {
            if (metodo === "PIX") {
              pix.mutate({ amount_cents: Number(valor) });
            } else {
              pagamento.mutate({
                method: metodo,
                amount_cents: Number(valor),
                change_cents: metodo === "CASH" ? Number(troco) : undefined,
              });
            }
          }}
        >
          Receber pagamento
        </Botao>
        <Botao variante="secundario" onClick={() => fechar.mutate()} disabled={fechar.isPending}>
          Fechar caixa
        </Botao>
      </div>

      {qrPix && (
        <div className="mt-4 rounded-sm bg-bg-soft p-4 font-mono text-xs break-all">
          QR Pix: {qrPix}
        </div>
      )}
    </Cartao>
  );
}
