export type SegmentoCliente = "NORMAL" | "REGULAR" | "PLATINUM";

export interface Cliente {
  id: string;
  tenant_id: string;
  name: string;
  phone: string;
  email?: string;
  since: string;
  segment: SegmentoCliente;
  no_show_count: number;
  total_visits: number;
  blocked: boolean;
  preferred_barber_id?: string;
  notes?: string;
}
