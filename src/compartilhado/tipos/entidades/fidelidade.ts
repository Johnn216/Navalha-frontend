export interface CartaoFidelidade {
  client_id: string;
  stamps: number;
  target: number;
  rewards_available: number;
  updated_at: string;
}

export interface PlanoClube {
  id: string;
  tenant_id: string;
  name: string;
  price_cents: number;
  interval: "MONTHLY";
  benefits: Record<string, unknown>;
}

export type StatusAssinatura = "ACTIVE" | "PAST_DUE" | "CANCELED";

export interface Assinatura {
  id: string;
  client_id: string;
  plan_id: string;
  status: StatusAssinatura;
  card_token?: string;
  next_charge_at: string;
}
