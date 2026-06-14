export type TemaConta = "CLASSICO" | "MODERNO" | "TERRA";

export type StatusConta =
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED";

export type PlanoSaaS = "STARTER" | "PRO" | "ENTERPRISE";

export interface Conta {
  id: string;
  name: string;
  theme: TemaConta;
  plan: PlanoSaaS;
  status: StatusConta;
  created_at: string;
}
