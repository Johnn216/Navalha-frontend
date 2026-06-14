export type PapelUsuario =
  | "OWNER"
  | "MANAGER"
  | "RECEPTION"
  | "BARBER"
  | "CLIENT";

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

export type SegmentoCliente = "NORMAL" | "REGULAR" | "PLATINUM";

export type MetodoPagamento = "PIX" | "CARD" | "CASH";

export type StatusPagamento = "PENDING" | "PAID" | "REFUNDED";

export type FonteAgendamento =
  | "PUBLIC_LINK"
  | "MARKETPLACE"
  | "WHATSAPP"
  | "RECEPTION"
  | "CLIENT_APP";

export type TemaConta = "CLASSICO" | "MODERNO" | "TERRA";

export type StatusSessaoCaixa = "OPEN" | "CLOSED";

export interface Usuario {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone?: string;
  role: PapelUsuario;
  avatar_url?: string;
}

export interface Unidade {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  address?: string;
  city?: string;
  state?: string;
  timezone: string;
  public_booking_enabled: boolean;
}

export interface Cliente {
  id: string;
  tenant_id: string;
  name: string;
  phone: string;
  email?: string;
  since?: string;
  segment: SegmentoCliente;
  no_show_count: number;
  total_visits: number;
  blocked: boolean;
  preferred_barber_id?: string;
  notes?: string;
}

export interface Servico {
  id: string;
  tenant_id: string;
  unit_id: string;
  name: string;
  category: string;
  price_cents: number;
  duration_min: number;
  active: boolean;
}

export interface Barbeiro {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  specialties: string[];
  public_slug: string;
  rating_avg: number;
  avatar_url?: string;
  unit_id: string;
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
  source: FonteAgendamento;
  no_show_risk?: number;
  service_ids?: string[];
  client?: Cliente;
  barber?: Barbeiro;
}

export interface SlotDisponibilidade {
  starts_at: string;
  status: "AVAILABLE" | "TAKEN" | "OVERBOOK";
}

export interface CartaoFidelidade {
  client_id: string;
  stamps: number;
  target: number;
  rewards_available: number;
}

export interface PlanoClube {
  id: string;
  tenant_id: string;
  name: string;
  price_cents: number;
  interval: "MONTHLY";
  benefits: string[];
}

export interface Produto {
  id: string;
  unit_id: string;
  name: string;
  qty: number;
  min_qty: number;
  unit_cost_cents: number;
  low_stock?: boolean;
}

export interface MensagemWhatsApp {
  id: string;
  client_id: string;
  appointment_id?: string;
  direction: "OUT" | "IN";
  template?: string;
  body: string;
  status: "SENT" | "DELIVERED" | "READ" | "REPLIED";
  created_at: string;
  client?: Cliente;
}

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

export interface Pagamento {
  id: string;
  appointment_id?: string;
  cash_session_id: string;
  method: MetodoPagamento;
  amount_cents: number;
  change_cents?: number;
  status: StatusPagamento;
}

export interface RegraComissao {
  id: string;
  tenant_id: string;
  scope: "BARBER" | "SERVICE" | "UNIT" | "GLOBAL";
  type: "PERCENT" | "FIXED" | "TIERED" | "PER_SERVICE";
  value: number | Record<string, number>;
  priority: number;
}

export interface LancamentoComissao {
  id: string;
  appointment_id: string;
  barber_id: string;
  base_cents: number;
  amount_cents: number;
  period: string;
  status: "ACCRUED" | "PAID";
}

export interface MetricasVisaoGeral {
  revenue_cents: number;
  revenue_delta_pct: number;
  occupancy_pct: number;
  avg_ticket_cents: number;
  no_show_pct: number;
}

export interface SerieFaturamento {
  label: string;
  value_cents: number;
}

export interface RankingBarbeiro {
  barber_id: string;
  display_name: string;
  revenue_cents: number;
  cuts: number;
  occupancy_pct: number;
  delta_pct: number;
}

export interface ItemFilaEspera {
  id: string;
  client_id: string;
  client_name: string;
  service_id: string;
  service_name: string;
  preferred_barber_id?: string;
  created_at: string;
}

export interface PostPortfolio {
  id: string;
  barber_id: string;
  image_url: string;
  caption: string;
  service_id?: string;
  likes: number;
  published_at: string;
}

export interface PerfilPublicoUnidade {
  id: string;
  name: string;
  slug: string;
  city: string;
  rating_avg: number;
  barbers: Barbeiro[];
  services: Servico[];
}

export interface EstadoOnboarding {
  current_step: number;
  steps: { n: number; done: boolean; title: string }[];
}
