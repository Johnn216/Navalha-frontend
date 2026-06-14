import { http, HttpResponse } from "msw";
import {
  agendamentos,
  barbeiros,
  clientes,
  estadoOnboarding,
  filaEspera,
  fidelidadeRicardo,
  gerarSlotsDisponibilidade,
  lancamentosComissao,
  marketplaceUnidades,
  mensagensWhatsApp,
  metricasVisaoGeral,
  perfilPublico,
  planosClube,
  portfolioPosts,
  produtos,
  rankingBarbeiros,
  regrasComissao,
  serieFaturamento,
  servicos,
  sessaoCaixa,
  unidadeCentro,
  usuariosDemo,
} from "@/compartilhado/mocks/dados-sementes";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

function paginar<T>(items: T[], page = 1, limit = 20) {
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: {
      page,
      limit,
      total: items.length,
      total_pages: Math.ceil(items.length / limit),
    },
  };
}

export const handlers = [
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = Object.values(usuariosDemo).find((u) => u.email === body.email);
    if (!user || user.password !== body.password) {
      return HttpResponse.json(
        { error: { code: "CREDENCIAIS_INVALIDAS", message: "E-mail ou senha incorretos" } },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      access_token: `mock-token-${user.role.toLowerCase()}`,
      refresh_token: `mock-refresh-${user.role.toLowerCase()}`,
    });
  }),

  http.post(`${BASE}/auth/signup`, async () => {
    return HttpResponse.json({
      access_token: "mock-token-owner",
      refresh_token: "mock-refresh-owner",
    });
  }),

  http.post(`${BASE}/auth/refresh`, () =>
    HttpResponse.json({
      access_token: "mock-token-refreshed",
      refresh_token: "mock-refresh-refreshed",
    })
  ),

  http.get(`${BASE}/me`, ({ request }) => {
    const auth = request.headers.get("Authorization") ?? "";
    const role = auth.includes("reception")
      ? "RECEPTION"
      : auth.includes("barber")
        ? "BARBER"
        : auth.includes("client")
          ? "CLIENT"
          : "OWNER";
    const key = role === "OWNER" ? "owner" : role === "RECEPTION" ? "reception" : role === "BARBER" ? "barber" : "client";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = usuariosDemo[key];
    return HttpResponse.json({ user, role, units: [unidadeCentro] });
  }),

  http.get(`${BASE}/tenant`, () =>
    HttpResponse.json({ id: "tenant-navalha-001", name: "Navalha", theme: "CLASSICO", plan: "PRO" })
  ),

  http.get(`${BASE}/units`, () => HttpResponse.json([unidadeCentro])),

  http.get(`${BASE}/onboarding`, () => HttpResponse.json(estadoOnboarding)),
  http.patch(`${BASE}/onboarding/steps/:n`, () => HttpResponse.json({ ok: true })),
  http.post(`${BASE}/onboarding/publish`, () => HttpResponse.json({ ok: true })),

  http.get(`${BASE}/services`, () => HttpResponse.json(servicos)),
  http.get(`${BASE}/barbers`, () => HttpResponse.json(barbeiros)),
  http.get(`${BASE}/barbers/:id`, ({ params }) => {
    const b = barbeiros.find((x) => x.id === params.id);
    return b ? HttpResponse.json(b) : new HttpResponse(null, { status: 404 });
  }),

  http.get(`${BASE}/appointments`, ({ request }) => {
    const url = new URL(request.url);
    const unit_id = url.searchParams.get("unit_id");
    const filtered = agendamentos.filter((a) => !unit_id || a.unit_id === unit_id);
    return HttpResponse.json(paginar(filtered));
  }),

  http.get(`${BASE}/appointments/:id`, ({ params }) => {
    const a = agendamentos.find((x) => x.id === params.id);
    return a ? HttpResponse.json(a) : new HttpResponse(null, { status: 404 });
  }),

  http.get(`${BASE}/appointments/:id/risk`, ({ params }) => {
    const a = agendamentos.find((x) => x.id === params.id);
    return HttpResponse.json({
      no_show_risk: a?.no_show_risk ?? 0.2,
      signals: a && (a.no_show_risk ?? 0) > 0.5 ? ["Histórico de faltas", "Primeira confirmação pendente"] : [],
    });
  }),

  http.post(`${BASE}/appointments`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      ...agendamentos[0],
      id: "apt-new",
      code: "#0145",
      ...body,
      status: "PENDING",
    });
  }),

  http.get(`${BASE}/availability`, ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("date") ?? new Date().toISOString().split("T")[0];
    return HttpResponse.json(gerarSlotsDisponibilidade(date));
  }),

  http.get(`${BASE}/public/u/:slug`, () => HttpResponse.json(perfilPublico)),
  http.get(`${BASE}/public/u/:slug/availability`, ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("date") ?? new Date().toISOString().split("T")[0];
    return HttpResponse.json(gerarSlotsDisponibilidade(date));
  }),
  http.post(`${BASE}/public/u/:slug/book`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...agendamentos[0], id: "apt-public", status: "PENDING", ...(body as object) });
  }),

  http.get(`${BASE}/public/marketplace`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    return HttpResponse.json(paginar(marketplaceUnidades, page));
  }),

  http.get(`${BASE}/metrics/overview`, () => HttpResponse.json(metricasVisaoGeral)),
  http.get(`${BASE}/metrics/revenue-series`, () => HttpResponse.json(serieFaturamento)),
  http.get(`${BASE}/metrics/barber-ranking`, () => HttpResponse.json(rankingBarbeiros)),

  http.get(`${BASE}/clients`, () => HttpResponse.json(paginar(clientes))),
  http.get(`${BASE}/clients/:id`, ({ params }) => {
    const c = clientes.find((x) => x.id === params.id);
    return c ? HttpResponse.json(c) : new HttpResponse(null, { status: 404 });
  }),
  http.get(`${BASE}/clients/:id/loyalty`, () => HttpResponse.json(fidelidadeRicardo)),
  http.post(`${BASE}/clients/:id/loyalty/redeem`, () =>
    HttpResponse.json({ ...fidelidadeRicardo, rewards_available: 1, stamps: 0 })
  ),

  http.get(`${BASE}/waitlist`, () => HttpResponse.json(filaEspera)),
  http.post(`${BASE}/waitlist`, () => HttpResponse.json({ ok: true })),

  http.get(`${BASE}/cash/sessions/current`, () => HttpResponse.json(sessaoCaixa)),
  http.post(`${BASE}/cash/sessions/open`, () => HttpResponse.json(sessaoCaixa)),
  http.post(`${BASE}/cash/sessions/:id/close`, () =>
    HttpResponse.json({ ...sessaoCaixa, status: "CLOSED", closed_at: new Date().toISOString() })
  ),

  http.post(`${BASE}/payments`, () =>
    HttpResponse.json({ id: "pay-001", method: "PIX", amount_cents: 8000, status: "PAID" })
  ),
  http.post(`${BASE}/payments/pix/intent`, () =>
    HttpResponse.json({ qr_code: "00020126580014br.gov.bcb.pix", intent_id: "pix-001" })
  ),

  http.get(`${BASE}/commission/rules`, () => HttpResponse.json(regrasComissao)),
  http.get(`${BASE}/commission/entries`, () => HttpResponse.json(paginar(lancamentosComissao))),

  http.get(`${BASE}/whatsapp/inbox`, () => HttpResponse.json(mensagensWhatsApp)),
  http.post(`${BASE}/whatsapp/send`, () => HttpResponse.json({ ok: true })),

  http.get(`${BASE}/products`, () => HttpResponse.json(produtos)),
  http.get(`${BASE}/plans`, () => HttpResponse.json(planosClube)),
  http.get(`${BASE}/barbers/:id/portfolio`, () => HttpResponse.json(portfolioPosts)),
  http.get(`${BASE}/notifications`, () => HttpResponse.json([])),
];
