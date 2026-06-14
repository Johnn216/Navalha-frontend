"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  conectarTempoReal,
  type EventoTempoReal,
} from "@/compartilhado/lib/api/servicos/tempo-real.servico";
import { chavesConsultaRecepcao } from "@/funcionalidades/recepcao/hooks/useRecepcao";

export function useTempoReal(unidadeId: string | undefined) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!unidadeId) return;

    const invalidar = (evento: EventoTempoReal) => {
      switch (evento.type) {
        case "appointment_updated":
          qc.invalidateQueries({ queryKey: ["recepcao", "agendamentos", unidadeId] });
          break;
        case "whatsapp_message":
          qc.invalidateQueries({ queryKey: chavesConsultaRecepcao.whatsapp(unidadeId) });
          break;
        case "waitlist_updated":
          qc.invalidateQueries({ queryKey: chavesConsultaRecepcao.fila(unidadeId) });
          break;
        case "payment_updated":
          qc.invalidateQueries({ queryKey: chavesConsultaRecepcao.caixa(unidadeId) });
          break;
      }
    };

    return conectarTempoReal(unidadeId, invalidar);
  }, [unidadeId, qc]);
}
