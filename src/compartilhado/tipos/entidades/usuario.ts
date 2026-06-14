export type PapelUsuario =
  | "OWNER"
  | "MANAGER"
  | "RECEPTION"
  | "BARBER"
  | "CLIENT";

export interface Usuario {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone: string;
  role: PapelUsuario;
  avatar_url?: string;
}

export interface SessaoUsuario {
  user: Usuario;
  role: PapelUsuario;
  units: { id: string; name: string; slug: string }[];
}
