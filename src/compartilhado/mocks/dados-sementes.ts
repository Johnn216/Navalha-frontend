import type {
  Agendamento,
  Barbeiro,
  Cliente,
  LancamentoComissao,
  MensagemWhatsApp,
  MetricasVisaoGeral,
  PlanoClube,
  PostPortfolio,
  Produto,
  RankingBarbeiro,
  RegraComissao,
  SerieFaturamento,
  Servico,
  SessaoCaixa,
  Unidade,
  Usuario,
  ItemFilaEspera,
  PerfilPublicoUnidade,
  EstadoOnboarding,
  CartaoFidelidade,
} from "@/compartilhado/tipos/entidades";

export const TENANT_ID = "tenant-navalha-001";
export const UNIT_CENTRO_ID = "unit-centro-001";

export const unidadeCentro: Unidade = {
  id: UNIT_CENTRO_ID,
  tenant_id: TENANT_ID,
  name: "Navalha · Centro",
  slug: "navalha-centro",
  address: "Rua das Flores, 142",
  city: "São Paulo",
  state: "SP",
  timezone: "America/Sao_Paulo",
  public_booking_enabled: true,
};

export const usuariosDemo: Record<string, Usuario & { password: string }> = {
  owner: {
    id: "user-owner-001",
    tenant_id: TENANT_ID,
    name: "Carlos Mendes",
    email: "dono@navalha.com",
    phone: "11999990001",
    role: "OWNER",
    password: "demo123",
  },
  reception: {
    id: "user-reception-001",
    tenant_id: TENANT_ID,
    name: "Ana Silva",
    email: "recepcao@navalha.com",
    phone: "11999990002",
    role: "RECEPTION",
    password: "demo123",
  },
  barber: {
    id: "user-barber-001",
    tenant_id: TENANT_ID,
    name: "Rafael Santos",
    email: "rafael@navalha.com",
    phone: "11999990003",
    role: "BARBER",
    password: "demo123",
  },
  client: {
    id: "user-client-001",
    tenant_id: TENANT_ID,
    name: "Ricardo Albuquerque",
    email: "ricardo@email.com",
    phone: "11988880001",
    role: "CLIENT",
    password: "demo123",
  },
};

export const barbeiros: Barbeiro[] = [
  {
    id: "barber-rafael",
    user_id: "user-barber-001",
    display_name: "Rafael Santos",
    bio: "Especialista em degradê e visagismo",
    specialties: ["degradê", "visagismo", "barba"],
    public_slug: "rafael-santos",
    rating_avg: 4.9,
    unit_id: UNIT_CENTRO_ID,
    avatar_url: "/avatars/rafael.jpg",
  },
  {
    id: "barber-bruno",
    user_id: "user-barber-002",
    display_name: "Bruno Mello",
    bio: "Barba clássica e navalha",
    specialties: ["barba", "navalha"],
    public_slug: "bruno-mello",
    rating_avg: 4.7,
    unit_id: UNIT_CENTRO_ID,
    avatar_url: "/avatars/bruno.jpg",
  },
];

export const servicos: Servico[] = [
  {
    id: "svc-corte-simples",
    tenant_id: TENANT_ID,
    unit_id: UNIT_CENTRO_ID,
    name: "Corte simples",
    category: "corte",
    price_cents: 5000,
    duration_min: 30,
    active: true,
  },
  {
    id: "svc-corte-barba",
    tenant_id: TENANT_ID,
    unit_id: UNIT_CENTRO_ID,
    name: "Corte degradê + Barba",
    category: "combo",
    price_cents: 8000,
    duration_min: 30,
    active: true,
  },
  {
    id: "svc-visagismo",
    tenant_id: TENANT_ID,
    unit_id: UNIT_CENTRO_ID,
    name: "Visagismo + Sobrancelha",
    category: "visagismo",
    price_cents: 11000,
    duration_min: 45,
    active: true,
  },
];

export const clientes: Cliente[] = [
  {
    id: "client-ricardo",
    tenant_id: TENANT_ID,
    name: "Ricardo Albuquerque",
    phone: "11988880001",
    since: "2024-01-15",
    segment: "PLATINUM",
    no_show_count: 0,
    total_visits: 14,
    blocked: false,
    preferred_barber_id: "barber-rafael",
  },
  {
    id: "client-joao",
    tenant_id: TENANT_ID,
    name: "João Marcelo",
    phone: "11988880002",
    segment: "NORMAL",
    no_show_count: 0,
    total_visits: 1,
    blocked: false,
  },
  {
    id: "client-lucas",
    tenant_id: TENANT_ID,
    name: "Lucas Andrade",
    phone: "11988880003",
    segment: "REGULAR",
    no_show_count: 1,
    total_visits: 6,
    blocked: false,
    preferred_barber_id: "barber-rafael",
  },
];

const hoje = new Date();
const dataBase = hoje.toISOString().split("T")[0];

export const agendamentos: Agendamento[] = [
  {
    id: "apt-0142",
    tenant_id: TENANT_ID,
    unit_id: UNIT_CENTRO_ID,
    code: "#0142",
    client_id: "client-ricardo",
    barber_id: "barber-rafael",
    starts_at: `${dataBase}T14:30:00-03:00`,
    duration_min: 30,
    status: "IN_SERVICE",
    total_cents: 8000,
    source: "RECEPTION",
    no_show_risk: 0.05,
    service_ids: ["svc-corte-barba"],
    client: clientes[0],
    barber: barbeiros[0],
  },
  {
    id: "apt-0143",
    tenant_id: TENANT_ID,
    unit_id: UNIT_CENTRO_ID,
    code: "#0143",
    client_id: "client-joao",
    barber_id: "barber-bruno",
    starts_at: `${dataBase}T15:00:00-03:00`,
    duration_min: 45,
    status: "CONFIRMED",
    total_cents: 11000,
    source: "PUBLIC_LINK",
    no_show_risk: 0.35,
    service_ids: ["svc-visagismo"],
    client: clientes[1],
    barber: barbeiros[1],
  },
  {
    id: "apt-0144",
    tenant_id: TENANT_ID,
    unit_id: UNIT_CENTRO_ID,
    code: "#0144",
    client_id: "client-lucas",
    barber_id: "barber-rafael",
    starts_at: `${dataBase}T16:00:00-03:00`,
    duration_min: 30,
    status: "PENDING",
    total_cents: 5000,
    source: "WHATSAPP",
    no_show_risk: 0.72,
    service_ids: ["svc-corte-simples"],
    client: clientes[2],
    barber: barbeiros[0],
  },
];

export const metricasVisaoGeral: MetricasVisaoGeral = {
  revenue_cents: 4280000,
  revenue_delta_pct: 24,
  occupancy_pct: 87,
  avg_ticket_cents: 7800,
  no_show_pct: 4.2,
};

export const serieFaturamento: SerieFaturamento[] = [
  { label: "Jan", value_cents: 2800000 },
  { label: "Fev", value_cents: 3100000 },
  { label: "Mar", value_cents: 2950000 },
  { label: "Abr", value_cents: 3200000 },
  { label: "Mai", value_cents: 3400000 },
  { label: "Jun", value_cents: 3600000 },
  { label: "Jul", value_cents: 3500000 },
  { label: "Ago", value_cents: 3700000 },
  { label: "Set", value_cents: 3450000 },
  { label: "Out", value_cents: 4280000 },
  { label: "Nov", value_cents: 4100000 },
  { label: "Dez", value_cents: 4500000 },
];

export const rankingBarbeiros: RankingBarbeiro[] = [
  {
    barber_id: "barber-rafael",
    display_name: "Rafael Santos",
    revenue_cents: 1240000,
    cuts: 142,
    occupancy_pct: 92,
    delta_pct: 18,
  },
  {
    barber_id: "barber-bruno",
    display_name: "Bruno Mello",
    revenue_cents: 980000,
    cuts: 118,
    occupancy_pct: 84,
    delta_pct: 9,
  },
];

export const filaEspera: ItemFilaEspera[] = [
  {
    id: "wait-001",
    client_id: "client-lucas",
    client_name: "Lucas Andrade",
    service_id: "svc-corte-simples",
    service_name: "Corte simples",
    preferred_barber_id: "barber-rafael",
    created_at: new Date().toISOString(),
  },
];

export const sessaoCaixa: SessaoCaixa = {
  id: "cash-001",
  unit_id: UNIT_CENTRO_ID,
  opened_by: "user-reception-001",
  opened_at: `${dataBase}T08:00:00-03:00`,
  opening_float_cents: 20000,
  expected_cents: 84000,
  status: "OPEN",
};

export const mensagensWhatsApp: MensagemWhatsApp[] = [
  {
    id: "wa-001",
    client_id: "client-ricardo",
    appointment_id: "apt-0142",
    direction: "IN",
    body: "Confirmo meu horário das 14:30!",
    status: "READ",
    created_at: new Date().toISOString(),
    client: clientes[0],
  },
  {
    id: "wa-002",
    client_id: "client-joao",
    direction: "OUT",
    template: "confirmacao",
    body: "Olá João! Confirma seu agendamento às 15:00?",
    status: "DELIVERED",
    created_at: new Date().toISOString(),
    client: clientes[1],
  },
];

export const produtos: Produto[] = [
  {
    id: "prod-001",
    unit_id: UNIT_CENTRO_ID,
    name: "Pomada Modeladora",
    qty: 12,
    min_qty: 5,
    unit_cost_cents: 2800,
    low_stock: false,
  },
  {
    id: "prod-002",
    unit_id: UNIT_CENTRO_ID,
    name: "Navalha Descartável",
    qty: 3,
    min_qty: 10,
    unit_cost_cents: 150,
    low_stock: true,
  },
];

export const fidelidadeRicardo: CartaoFidelidade = {
  client_id: "client-ricardo",
  stamps: 8,
  target: 10,
  rewards_available: 0,
};

export const planosClube: PlanoClube[] = [
  {
    id: "plan-clube",
    tenant_id: TENANT_ID,
    name: "Clube do Corte",
    price_cents: 9900,
    interval: "MONTHLY",
    benefits: ["2 cortes/mês", "10% desconto em produtos", "Prioridade na fila"],
  },
];

export const regrasComissao: RegraComissao[] = [
  {
    id: "rule-001",
    tenant_id: TENANT_ID,
    scope: "GLOBAL",
    type: "PERCENT",
    value: 40,
    priority: 1,
  },
];

export const lancamentosComissao: LancamentoComissao[] = [
  {
    id: "comm-001",
    appointment_id: "apt-0142",
    barber_id: "barber-rafael",
    base_cents: 8000,
    amount_cents: 3200,
    period: "2026-06",
    status: "ACCRUED",
  },
];

export const portfolioPosts: PostPortfolio[] = [
  {
    id: "port-001",
    barber_id: "barber-rafael",
    image_url: "/portfolio/corte-1.jpg",
    caption: "Degradê perfeito",
    service_id: "svc-corte-barba",
    likes: 42,
    published_at: new Date().toISOString(),
  },
];

export const estadoOnboarding: EstadoOnboarding = {
  current_step: 3,
  steps: [
    { n: 1, done: true, title: "Dados da barbearia" },
    { n: 2, done: true, title: "Equipe" },
    { n: 3, done: false, title: "Serviços" },
    { n: 4, done: false, title: "Horários" },
    { n: 5, done: false, title: "Integrações" },
    { n: 6, done: false, title: "Publicar" },
  ],
};

export const perfilPublico: PerfilPublicoUnidade = {
  id: UNIT_CENTRO_ID,
  name: "Navalha · Centro",
  slug: "navalha-centro",
  city: "São Paulo",
  rating_avg: 4.8,
  barbers: barbeiros,
  services: servicos,
};

export const marketplaceUnidades: PerfilPublicoUnidade[] = [
  perfilPublico,
  {
    id: "unit-jardins-001",
    name: "Navalha · Jardins",
    slug: "navalha-jardins",
    city: "São Paulo",
    rating_avg: 4.6,
    barbers: barbeiros.slice(0, 1),
    services: servicos,
  },
];

export function gerarSlotsDisponibilidade(date: string) {
  const slots = [];
  for (let h = 9; h <= 18; h++) {
    for (const m of [0, 30]) {
      if (h === 18 && m === 30) continue;
      const hora = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const taken = hora === "14:30" || hora === "15:00";
      slots.push({
        starts_at: `${date}T${hora}:00-03:00`,
        status: taken ? ("TAKEN" as const) : ("AVAILABLE" as const),
      });
    }
  }
  return slots;
}
