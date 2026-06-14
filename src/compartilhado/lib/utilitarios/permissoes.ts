import type { PapelUsuario } from "@/compartilhado/tipos/entidades";

type Acao =
  | "ver_agenda"
  | "gerenciar_caixa"
  | "ver_metricas"
  | "gerenciar_equipe"
  | "ver_comissao";

interface UsuarioPermissao {
  role: PapelUsuario;
}

const PERMISSOES: Record<PapelUsuario, Acao[]> = {
  OWNER: [
    "ver_agenda",
    "gerenciar_caixa",
    "ver_metricas",
    "gerenciar_equipe",
    "ver_comissao",
  ],
  MANAGER: [
    "ver_agenda",
    "gerenciar_caixa",
    "ver_metricas",
    "gerenciar_equipe",
    "ver_comissao",
  ],
  RECEPTION: ["ver_agenda", "gerenciar_caixa"],
  BARBER: ["ver_agenda", "ver_comissao"],
  CLIENT: [],
};

export function pode(
  usuario: UsuarioPermissao | null | undefined,
  acao: Acao
): boolean {
  if (!usuario) return false;
  return PERMISSOES[usuario.role]?.includes(acao) ?? false;
}

export function papelTemAcessoRota(
  role: PapelUsuario,
  pathname: string
): boolean {
  if (pathname.startsWith("/dono")) {
    return role === "OWNER" || role === "MANAGER";
  }
  if (pathname.startsWith("/recepcao")) {
    return role === "RECEPTION" || role === "OWNER" || role === "MANAGER";
  }
  if (pathname.startsWith("/barbeiro")) {
    return role === "BARBER";
  }
  if (pathname.startsWith("/cliente")) {
    return role === "CLIENT";
  }
  if (pathname.startsWith("/onboarding")) {
    return role === "OWNER" || role === "MANAGER";
  }
  return true;
}
