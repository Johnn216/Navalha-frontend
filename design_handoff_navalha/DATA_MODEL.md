# Navalha — Modelo de Dados

Entidades, campos e relacionamentos do sistema. Schema SQL sugerido (PostgreSQL). Todas as tabelas de negócio carregam `tenant_id` para isolamento multi-tenant (RLS).

> Convenções: `id` = UUID PK; `created_at`/`updated_at` timestamptz; valores monetários em **centavos** (`integer`) para evitar erro de ponto flutuante; enums em UPPER_SNAKE.

---

## 1. Diagrama de relacionamentos (resumo)

```
Tenant 1───N Unit
Tenant 1───N User ──(role)── OWNER | MANAGER | RECEPTION | BARBER
User   1───1 BarberProfile (quando role=BARBER)
Unit   1───N Service
Unit   1───N Barber(User) via UnitMembership
Barber 1───N WorkShift / TimeBlock
Tenant 1───N Client
Client N───N Unit (frequenta)
Appointment ──► Client, Barber, Service(s), Unit, (Payment), (CommissionEntry), (NoShowScore)
Appointment 1───N AppointmentItem (serviços do agendamento)
Payment ──► Appointment | CashSession
CashSession 1───N Payment   (caixa do dia por unidade)
CommissionRule ──► Barber | Service | Unit
CommissionEntry ──► Appointment, Barber
Subscription(Clube) ──► Client, Plan
LoyaltyCard ──► Client
Product(Estoque) ──► Unit
PortfolioPost ──► Barber
Invoice(NFS-e) ──► Appointment | CashSession
WhatsAppMessage ──► Client, Appointment
```

---

## 2. Entidades

### Tenant (conta / rede)
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| name | text | nome da rede/marca |
| theme | enum | `CLASSICO` \| `MODERNO` \| `TERRA` (padrão `CLASSICO`) |
| plan | enum | plano de assinatura do SaaS (ver `Pricing` na landing) |
| status | enum | `TRIALING` \| `ACTIVE` \| `PAST_DUE` \| `CANCELED` |
| created_at | timestamptz | trial 14 dias |

### Unit (unidade / loja)
| Campo | Tipo | Notas |
|---|---|---|
| id, tenant_id | uuid | |
| name | text | ex. "Navalha · Centro" |
| slug | text | usado no link público / marketplace |
| address, city, state | text | |
| timezone | text | default `America/Sao_Paulo` |
| public_booking_enabled | bool | link público ligado |
| opening_hours | jsonb | jornada por dia da semana |

### User
| Campo | Tipo | Notas |
|---|---|---|
| id, tenant_id | uuid | |
| name, email, phone | text | |
| role | enum | `OWNER` \| `MANAGER` \| `RECEPTION` \| `BARBER` |
| avatar_url | text | |
| password_hash | text | (ou provider externo) |

### UnitMembership (usuário ↔ unidade, N:N)
`user_id`, `unit_id`, `role_in_unit`. Permite barbeiro/secretária em mais de uma unidade.

### BarberProfile (1:1 com User role=BARBER)
| Campo | Tipo | Notas |
|---|---|---|
| user_id | uuid | |
| display_name | text | nome público |
| bio | text | |
| specialties | text[] | ex. {degradê, visagismo, barba} |
| public_slug | text | perfil/portfólio público |
| rating_avg | numeric | média de avaliações |

### Service (serviço do catálogo)
| Campo | Tipo | Notas |
|---|---|---|
| id, tenant_id, unit_id | uuid | |
| name | text | ex. "Corte degradê + Barba" |
| category | text | corte / barba / visagismo / sobrancelha / combo |
| price_cents | int | |
| duration_min | int | ex. 30, 45 |
| active | bool | |

### Client (cliente final / CRM)
| Campo | Tipo | Notas |
|---|---|---|
| id, tenant_id | uuid | |
| name, phone | text | phone é o identificador prático |
| email | text | opcional |
| since | date | "Cliente desde 2024" |
| segment | enum | `NORMAL` \| `REGULAR` \| `PLATINUM` (status) |
| no_show_count | int | histórico de faltas |
| total_visits | int | |
| blocked | bool | cliente problemático (regra anti no-show) |
| preferred_barber_id | uuid | |
| notes | text | preferências |

### Appointment (agendamento) — entidade central
| Campo | Tipo | Notas |
|---|---|---|
| id, tenant_id, unit_id | uuid | |
| code | text | ex. `#0142` (sequencial por unidade) |
| client_id | uuid | |
| barber_id | uuid | |
| starts_at | timestamptz | |
| duration_min | int | soma dos itens |
| status | enum | `PENDING` \| `CONFIRMED` \| `IN_SERVICE` \| `DONE` \| `PAID` \| `NO_SHOW` \| `CANCELED` \| `WAITLIST` \| `OVERBOOK` |
| total_cents | int | |
| source | enum | `PUBLIC_LINK` \| `MARKETPLACE` \| `WHATSAPP` \| `RECEPTION` \| `CLIENT_APP` |
| no_show_risk | numeric | 0–1, preenchido pela IA (ver FUNCTIONS) |
| created_at | timestamptz | |

### AppointmentItem (serviços dentro de um agendamento)
`appointment_id`, `service_id`, `price_cents`, `duration_min`. (Um agendamento pode ter "corte + barba".)

### WorkShift / TimeBlock (jornada e bloqueios do barbeiro)
- **WorkShift**: `barber_id`, `unit_id`, `weekday`, `start`, `end`.
- **TimeBlock**: `barber_id`, `starts_at`, `ends_at`, `reason` (`FERIAS` \| `ALMOCO` \| `REUNIAO` \| `OUTRO`).

### CommissionRule (regra de comissão)
| Campo | Tipo | Notas |
|---|---|---|
| id, tenant_id | uuid | |
| scope | enum | `BARBER` \| `SERVICE` \| `UNIT` \| `GLOBAL` |
| barber_id / service_id / unit_id | uuid | conforme escopo |
| type | enum | `PERCENT` \| `FIXED` \| `TIERED` \| `PER_SERVICE` |
| value | jsonb | percentual, valor fixo, ou tabela de faixas (escalonado) |
| priority | int | resolução quando múltiplas regras batem |

### CommissionEntry (comissão lançada)
`appointment_id`, `barber_id`, `base_cents`, `rule_id`, `amount_cents`, `period` (mês), `status` (`ACCRUED` \| `PAID`). Gerada no fechamento. Ver cálculo em `FUNCTIONS.md`.

### CashSession (sessão de caixa do dia, por unidade)
`unit_id`, `opened_by`, `opened_at`, `closed_at`, `opening_float_cents`, `expected_cents`, `counted_cents`, `status` (`OPEN` \| `CLOSED`).

### Payment
| Campo | Tipo | Notas |
|---|---|---|
| id, tenant_id, unit_id | uuid | |
| appointment_id | uuid | nullable (venda avulsa de produto) |
| cash_session_id | uuid | |
| method | enum | `PIX` \| `CARD` \| `CASH` |
| amount_cents | int | |
| change_cents | int | troco (dinheiro) |
| acquirer | text | Stone/Pagseguro/Cielo (cartão) |
| status | enum | `PENDING` \| `PAID` \| `REFUNDED` |
| reconciled | bool | conciliação automática |

### Subscription (Clube) + Plan
- **Plan**: `tenant_id`, `name` (ex. "Clube do Corte"), `price_cents`, `interval` (`MONTHLY`), `benefits` jsonb.
- **Subscription**: `client_id`, `plan_id`, `status` (`ACTIVE`\|`PAST_DUE`\|`CANCELED`), `card_token`, `next_charge_at`.

### LoyaltyCard (fidelidade "10 cortes → 1 grátis")
`client_id`, `stamps` (int, 0–10), `target` (default 10), `rewards_available` (int), `updated_at`.

### Product (estoque)
`unit_id`, `name` (pomada/navalha/óleo), `qty`, `min_qty` (alerta), `unit_cost_cents`.

### PortfolioPost (galeria)
`barber_id`, `image_url`, `caption`, `service_id`, `likes`, `published_at`. (Protótipo cita "+240 cortes publicados".)

### Invoice (NFS-e)
`tenant_id`, `unit_id`, `appointment_id`/`cash_session_id`, `number`, `pdf_url`, `status` (`ISSUED`\|`PENDING`\|`ERROR`), `municipality_ref`.

### WhatsAppMessage
`client_id`, `appointment_id`, `direction` (`OUT`\|`IN`), `template`, `body`, `status` (`SENT`\|`DELIVERED`\|`READ`\|`REPLIED`), `created_at`.

### Review (avaliação — marketplace)
`client_id`, `barber_id`/`unit_id`, `rating` (1–5), `comment`, `created_at`.

---

## 3. Estados do Appointment (máquina de estados)

```
                ┌─────────► CANCELED
                │
WAITLIST ─► PENDING ─► CONFIRMED ─► IN_SERVICE ─► DONE ─► PAID
                │            │
                │            └─► NO_SHOW (após tolerância, job)
                └─► OVERBOOK (sugestão da IA, vira CONFIRMED se encaixa)
```
- `PENDING`: criado, aguardando confirmação (WhatsApp/recepção).
- `CONFIRMED`: cliente confirmou (botão WhatsApp ou recepção).
- `IN_SERVICE`: barbeiro iniciou (badge "AGORA / Em atendimento").
- `DONE`: serviço concluído, aguardando pagamento.
- `PAID`: pago — dispara `CommissionEntry`, entra no caixa, elegível a NFS-e e fidelidade.
- `NO_SHOW`: faltou — incrementa `client.no_show_count`, pode disparar taxa.
- `CANCELED`: cancelado — libera slot, aciona lista de espera.

---

## 4. Exemplo de seed (dados reais dos protótipos)

Útil para preencher a UI de demo (os números aparecem nas telas):

- **Barbeiros:** Rafael Santos (R$ 12,4k/mês, 142 cortes, 92% ocup., +18%), Bruno Mello (R$ 9,8k, 118 cortes, 84%, +9%).
- **Clientes:** Ricardo Albuquerque (Platinum, 14 cortes, 8/10 fidelidade, cliente desde 2024), João Marcelo (1ª vez), Lucas Andrade.
- **Serviços:** Corte simples (R$ 50, 30min), Corte degradê + Barba (R$ 80, 30min), Visagismo + Sobrancelha (R$ 110, 45min).
- **Agendamentos do dia (unidade Centro):** `#0142` 14:30 Ricardo · Rafael · em atendimento · R$ 80; `#0143` 15:00 João · Bruno · confirmado · R$ 110; `#0144` 16:00 Lucas · Rafael · aguardando · R$ 50.
- **KPIs dono (Outubro):** Receita R$ 42,8k, ocupação 87%, +24% vs setembro.
- **KPIs operação:** 3 em atendimento, 5 na fila, R$ 840 no caixa.
- **Métricas de marca (landing):** R$ 4,28M/mês processado, 87% ocupação média, −68% no-show com IA, 12min setup médio.
