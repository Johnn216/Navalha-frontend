export const TAMANHO_PAGINA_PADRAO = 20;
export const FUSO_HORARIO_PADRAO = "America/Sao_Paulo";
export const CHAVE_TEMA = "navalha-theme";
export const CHAVE_TOKEN = "navalha-token";

export const ROTAS_POR_PAPEL: Record<string, string> = {
  OWNER: "/dono",
  MANAGER: "/dono",
  RECEPTION: "/recepcao",
  BARBER: "/barbeiro",
  CLIENT: "/cliente",
};

export const TEMAS = ["classico", "moderno", "terra"] as const;
export type TemaId = (typeof TEMAS)[number];

export const MAPA_TEMA_API: Record<string, TemaId> = {
  CLASSICO: "classico",
  MODERNO: "moderno",
  TERRA: "terra",
};

export const MAPA_TEMA_PARA_API: Record<TemaId, string> = {
  classico: "CLASSICO",
  moderno: "MODERNO",
  terra: "TERRA",
};
