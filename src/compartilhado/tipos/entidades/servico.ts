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
