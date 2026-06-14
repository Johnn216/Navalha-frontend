import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROTAS_PROTEGIDAS = ["/dono", "/recepcao", "/barbeiro", "/cliente", "/onboarding"];

const PAPEL_POR_ROTA: Record<string, string[]> = {
  "/dono": ["OWNER", "MANAGER"],
  "/recepcao": ["RECEPTION", "OWNER", "MANAGER"],
  "/barbeiro": ["BARBER"],
  "/cliente": ["CLIENT"],
  "/onboarding": ["OWNER", "MANAGER"],
};

function extrairPapel(token: string | undefined): string | null {
  if (!token) return null;
  if (token.includes("reception")) return "RECEPTION";
  if (token.includes("barber")) return "BARBER";
  if (token.includes("client")) return "CLIENT";
  if (token.includes("owner")) return "OWNER";
  return "OWNER";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rotaProtegida = ROTAS_PROTEGIDAS.find((r) => pathname.startsWith(r));

  if (!rotaProtegida) return NextResponse.next();

  const token =
    request.cookies.get("navalha-token")?.value ??
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token && process.env.NEXT_PUBLIC_USAR_MOCKS === "true") {
    return NextResponse.next();
  }

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  const papel = extrairPapel(token);
  const papeisPermitidos = PAPEL_POR_ROTA[rotaProtegida];

  if (papel && papeisPermitidos && !papeisPermitidos.includes(papel)) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dono/:path*", "/recepcao/:path*", "/barbeiro/:path*", "/cliente/:path*", "/onboarding/:path*"],
};
