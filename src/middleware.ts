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

function decodificarRoleJwt(token: string): string | null {
  const partes = token.split(".");
  if (partes.length !== 3) return null;
  try {
    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { role?: string };
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

function extrairPapel(token: string | undefined): string | null {
  if (!token) return null;
  const jwtRole = decodificarRoleJwt(token);
  if (jwtRole) return jwtRole;
  if (token.includes("reception")) return "RECEPTION";
  if (token.includes("barber")) return "BARBER";
  if (token.includes("client")) return "CLIENT";
  if (token.includes("owner")) return "OWNER";
  return null;
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
