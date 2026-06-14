export interface MetaPaginacao {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface RespostaPaginada<T> {
  data: T[];
  meta: MetaPaginacao;
}

export interface ErroApi {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface RespostaAutenticacao {
  access_token: string;
  refresh_token: string;
}

export interface RespostaMe {
  user: import("@/compartilhado/tipos/entidades").Usuario;
  role: import("@/compartilhado/tipos/entidades").PapelUsuario;
  units: import("@/compartilhado/tipos/entidades").Unidade[];
}

export interface RespostaRiscoNoShow {
  no_show_risk: number;
  signals: string[];
}
