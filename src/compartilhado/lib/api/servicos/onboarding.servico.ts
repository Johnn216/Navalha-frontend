import { clienteApi } from "@/compartilhado/lib/api/cliente-api";
import type { EstadoOnboarding } from "@/compartilhado/tipos/entidades";

export async function obterOnboarding() {
  return clienteApi.get<EstadoOnboarding>("/onboarding");
}

export async function salvarPassoOnboarding(n: number, dados: unknown) {
  return clienteApi.patch(`/onboarding/steps/${n}`, dados);
}

export async function publicarOnboarding() {
  return clienteApi.post("/onboarding/publish");
}

export async function importarOnboarding(arquivo: FormData) {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/onboarding/import`,
    { method: "POST", body: arquivo }
  );
}
