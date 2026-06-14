# Integração Backend — Navalha Frontend

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base da API REST, ex. `https://api.navalha.com/api/v1` |
| `NEXT_PUBLIC_USAR_MOCKS` | `true` = MSW no browser; `false` = API real |

## Autenticação

1. `POST /auth/login` → `{ access_token, refresh_token }`
2. Frontend armazena em `localStorage` (`navalha-token`, `navalha-refresh`)
3. `GET /me` → `{ user, role, units[] }`
4. Refresh automático em 401 via `POST /auth/refresh`

**Produção recomendada:** cookies httpOnly setados pelo backend; ajustar `cliente-api.ts`.

## Contrato de resposta

- Erros: `{ error: { code, message, details? } }`
- Paginação: `{ data: T[], meta: { page, limit, total, total_pages } }`
- Monetário: **centavos** (integer)
- Datas: ISO-8601 com timezone

## Escopo multi-tenant

- `tenant_id` no JWT (não na URL)
- Filtro de unidade: `?unit_id=` quando aplicável

## Rotas públicas (sem auth)

- `GET /public/u/:slug`
- `GET /public/u/:slug/availability`
- `POST /public/u/:slug/book`
- `GET /public/marketplace`

## Realtime

- WebSocket: `WS /realtime?unit_id=`
- Eventos: `appointment_updated`, `whatsapp_message`, `waitlist_updated`, `payment_updated`

## RBAC (middleware frontend)

| Papel | Rota |
|---|---|
| OWNER, MANAGER | `/dono`, `/onboarding` |
| RECEPTION | `/recepcao` |
| BARBER | `/barbeiro` |
| CLIENT | `/cliente` |

Backend deve validar permissões em cada endpoint.

## Serviços espelhados

Arquivos em `src/compartilhado/lib/api/servicos/` mapeiam 1:1 com `design_handoff_navalha/API.md`.

## MSW → API real

1. Defina `NEXT_PUBLIC_USAR_MOCKS=false`
2. Aponte `NEXT_PUBLIC_API_URL` para o backend
3. Handlers MSW em `compartilhado/mocks/handlers/` servem como documentação viva

## Deploy Render

Ver `render.yaml`. Build: `npm run build`. Start: `npm start` (porta `$PORT`).
