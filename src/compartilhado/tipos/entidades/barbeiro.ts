export interface PerfilBarbeiro {
  user_id: string;
  display_name: string;
  bio?: string;
  specialties: string[];
  public_slug: string;
  rating_avg: number;
}

export interface Barbeiro extends PerfilBarbeiro {
  id: string;
  tenant_id: string;
  unit_id: string;
  name: string;
  revenue_cents_month?: number;
  cuts_month?: number;
  occupancy_pct?: number;
  growth_pct?: number;
}
