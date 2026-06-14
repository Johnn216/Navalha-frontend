export type MetodoPagamento = "PIX" | "CARD" | "CASH";

export type StatusPagamento = "PENDING" | "PAID" | "REFUNDED";

export interface Pagamento {
  id: string;
  tenant_id: string;
  unit_id: string;
  appointment_id?: string;
  cash_session_id?: string;
  method: MetodoPagamento;
  amount_cents: number;
  change_cents?: number;
  acquirer?: string;
  status: StatusPagamento;
  reconciled: boolean;
}

export type StatusSessaoCaixa = "OPEN" | "CLOSED";

export interface SessaoCaixa {
  id: string;
  unit_id: string;
  opened_by: string;
  opened_at: string;
  closed_at?: string;
  opening_float_cents: number;
  expected_cents?: number;
  counted_cents?: number;
  status: StatusSessaoCaixa;
}
