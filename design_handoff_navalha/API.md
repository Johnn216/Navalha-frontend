# Navalha — API (superfície REST sugerida)

Endpoints por módulo. Convenções: prefixo `/api/v1`; auth via `Authorization: Bearer <jwt>`; todo recurso é escopado pelo `tenant_id` do token (não vai na URL). Unidade quando relevante via `?unit_id=` ou path. Valores monetários em **centavos**. Datas ISO-8601 com timezone.

> Ajuste para o estilo do codebase (REST/tRPC/GraphQL). Isto é a *intenção*; o que importa são os recursos e regras (ver `FUNCTIONS.md`).

---

## Auth & Tenancy
```
POST   /auth/signup                 # cria conta + dono (inicia trial 14d)
POST   /auth/login                  # → access + refresh token
POST   /auth/refresh
GET    /me                          # usuário, papel, unidades
GET    /tenant                      # conta, plano, tema
PATCH  /tenant                      # { theme: CLASSICO|MODERNO|TERRA, name }
GET    /units                       # lista unidades
POST   /units                       # cria unidade
PATCH  /units/:id                   # { public_booking_enabled, opening_hours, ... }
POST   /users/invite                # convida barbeiro/secretária/gerente
```

## Onboarding
```
GET    /onboarding                  # estado dos 6 passos
PATCH  /onboarding/steps/:n         # salva parcial (auto-save), marca done
POST   /onboarding/import           # importa serviços/clientes (CSV/XLSX)
POST   /onboarding/publish          # passo 6 → ativa booking público + marketplace
```

## Serviços (catálogo)
```
GET    /services?unit_id=
POST   /services                    # { name, category, price_cents, duration_min }
PATCH  /services/:id
DELETE /services/:id
```

## Equipe
```
GET    /barbers?unit_id=
GET    /barbers/:id                 # perfil + métricas
POST   /barbers/:id/shifts          # WorkShift
POST   /barbers/:id/blocks          # TimeBlock { reason: FERIAS|ALMOCO|REUNIAO }
DELETE /barbers/:id/blocks/:blockId
```

## Agenda & Booking
```
GET    /availability?unit_id&barber_id&service_id&date   # slots AVAILABLE/TAKEN/OVERBOOK
GET    /appointments?unit_id&date&barber_id&status       # agenda (recepção/barbeiro)
POST   /appointments                # cria (booking). { client(phone,name), barber_id, service_ids[], starts_at, source }
GET    /appointments/:id
PATCH  /appointments/:id/status     # transição de estado (ver máquina em DATA_MODEL §3)
POST   /appointments/:id/confirm    # confirmação (recepção)
POST   /appointments/:id/cancel
GET    /waitlist?unit_id            # fila de espera
POST   /waitlist                    # entra na fila
```
**Público (sem auth, por slug):**
```
GET    /public/u/:unitSlug                      # perfil público da unidade (marketplace)
GET    /public/u/:unitSlug/availability?...     # slots
POST   /public/u/:unitSlug/book                 # cria Appointment PENDING
GET    /public/b/:barberSlug                    # portfólio público do barbeiro
GET    /public/marketplace?city=&q=             # busca/descoberta (SEO/SSR)
```

## Anti no-show (IA)
```
GET    /appointments/:id/risk        # { no_show_risk, signals }
POST   /risk/recompute               # job/manual: recalcula score
GET    /overbook/suggestions?unit_id&date
```

## WhatsApp
```
GET    /whatsapp/inbox?unit_id       # mensagens (badge da recepção)
POST   /whatsapp/send                # template (reagendar, dúvida)
POST   /webhooks/whatsapp            # entrada da Business API (status/replies)
```

## Caixa & Pagamentos
```
POST   /cash/sessions/open           # { unit_id, opening_float_cents }
GET    /cash/sessions/current?unit_id
POST   /payments                     # { appointment_id?, method: PIX|CARD|CASH, amount_cents, change_cents? }
POST   /payments/pix/intent          # gera QR Code
POST   /webhooks/pix                 # confirmação do PSP
POST   /webhooks/acquirer            # retorno Stone/Pagseguro/Cielo
POST   /cash/sessions/:id/close      # fechamento 1 clique (gera comissão+DRE+NFS-e)
```

## Comissão
```
GET    /commission/rules
POST   /commission/rules             # { scope, type: PERCENT|FIXED|TIERED|PER_SERVICE, value, priority }
PATCH  /commission/rules/:id
GET    /commission/entries?barber_id&period      # carteira do barbeiro
GET    /commission/entries/export?barber_id&period   # comprovante PDF
```

## Financeiro (Dono)
```
GET    /metrics/overview?unit_id&period          # KPIs: receita, ocupação, ticket, no-show, deltas
GET    /metrics/revenue-series?unit_id&granularity=day|week|month
GET    /metrics/barber-ranking?unit_id&period
GET    /metrics/units-compare?period             # multi-unidade lado a lado
GET    /reports/dre?period&format=pdf
GET    /reports/cashflow?period&format=pdf
GET    /reports/sped?period
```

## Clientes (CRM)
```
GET    /clients?q=&segment=
GET    /clients/:id                  # ficha, histórico, preferências, fidelidade
PATCH  /clients/:id                  # { segment, blocked, notes, preferred_barber_id }
GET    /clients/:id/history          # cortes com foto
```

## Fidelidade & Clube
```
GET    /clients/:id/loyalty          # { stamps, target, rewards_available }
POST   /clients/:id/loyalty/redeem
GET    /plans                        # planos do clube
POST   /plans
POST   /subscriptions                # { client_id, plan_id, card_token }
DELETE /subscriptions/:id            # cancelamento livre
POST   /webhooks/recurring           # cobrança recorrente (resultado)
```

## Estoque
```
GET    /products?unit_id             # inclui flag low_stock (qty<=min_qty)
POST   /products
PATCH  /products/:id                 # ajusta qty/min_qty
```

## Portfólio & Avaliações
```
GET    /barbers/:id/portfolio
POST   /barbers/:id/portfolio        # { image_url, caption, service_id }   (Studio)
POST   /reviews                      # { barber_id|unit_id, rating, comment }
```

## Notificações / Realtime
```
WS     /realtime?unit_id             # badges live (agenda/whatsapp/fila), status de appointment/payment
GET    /notifications
```

---

## Padrões transversais
- **Erros**: `{ error: { code, message, details? } }`, HTTP semântico (400/401/403/404/409/422).
- **Paginação**: `?page=&limit=` ou cursor; respostas `{ data, meta }`.
- **Idempotência**: header `Idempotency-Key` em `POST /payments` e webhooks.
- **Webhooks**: validar assinatura; processar idempotente; responder rápido e enfileirar.
- **Permissões**: aplicar RBAC (ver `ARCHITECTURE.md §3`) — barbeiro só acessa os próprios recursos; secretária escopada à unidade; dono ao tenant.
- **Auditoria**: logar fechamento de caixa, alteração de comissão, exclusão de cliente.
