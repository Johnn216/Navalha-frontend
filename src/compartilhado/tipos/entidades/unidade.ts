export interface Unidade {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  timezone: string;
  public_booking_enabled: boolean;
  opening_hours: Record<string, { start: string; end: string } | null>;
}
