export function definirCookieSessao(nome: string, valor: string) {
  const expira = new Date(Date.now() + 7 * 864e5).toUTCString();
  document.cookie = `${nome}=${encodeURIComponent(valor)}; path=/; expires=${expira}; SameSite=Lax`;
}

export function removerCookieSessao(nome: string) {
  document.cookie = `${nome}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
