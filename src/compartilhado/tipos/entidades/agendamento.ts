export type StatusAgendamento =
  | "PENDING"
  | "CONFIRMED"
  | "IN_SERVICE"
  | "DONE"
  | "PAID"
  | "NO_SHOW"
  | "CANCELED"
  | "WAITLIST"
  | "OVERBOOK";

export type OrigemAgendamento =
  | "PUBLIC_LINK"
  | "MARKETPLACE"
  | "WHATSAPP"
  | "RECEPTION"
  | "CLIENT_APP";

export interface ItemAgendamento {
  service_id: string;
  price_cents: number;
  duration_min: number;
}

export interface Agendamento {
  id: string;
  tenant_id: string;
  unit_id: string;
  code: string;
  client_id: string;
  barber_id: string;
  starts_at: string;
  duration_min: number;
  status: StatusAgendamento;
  total_cents: number;
  source: OrigemAgendamento;
  no_show_risk?: number;
  created_at: string;
  items?: ItemAgendamento[];
  client_name?: string;
  barber_name?: string;
  service_name?: string;
}
