# IDs hardcoded — auditoria

Documentação dos IDs fixos encontrados no frontend e ações tomadas.

## `UNIT_CENTRO_ID` (`unit-centro-001`)

| Arquivo | Status |
|---------|--------|
| `src/compartilhado/mocks/dados-sementes.ts` | **Mantido** — apenas dados MSW/mock |
| `src/compartilhado/hooks/useUnidadeAtiva.tsx` | **Corrigido** — inicializa com `unidades[0].id` do `GET /me` |
| `src/funcionalidades/dono/componentes/PaginaDono.tsx` | **Corrigido** — usa `useUnidadeAtiva().unidadeId` |
| `src/funcionalidades/cliente/componentes/PaginaCliente.tsx` | **Corrigido** — usa `useUnidadeAtiva().unidadeId` |
| `src/funcionalidades/barbeiro/componentes/PaginaBarbeiro.tsx` | **Corrigido** — usa `useUnidadeAtiva().unidadeId` |
| `src/funcionalidades/onboarding/hooks/useOnboarding.ts` | **Corrigido** — `useServicosOnboarding(unitId)` |
| `src/funcionalidades/autenticacao/hooks/useAgendamentosDemo.ts` | **Corrigido** — usa `useUnidadeAtiva().unidadeId` |

### Impacto

Com `NEXT_PUBLIC_USAR_MOCKS=false`, IDs de mock não batem com Supabase real. Queries falhavam ou retornavam vazio. Agora a unidade vem da sessão (`/me`).

## `barber-rafael`

| Arquivo | Status |
|---------|--------|
| `src/compartilhado/mocks/dados-sementes.ts` | **Mantido** — apenas mocks |
| `src/funcionalidades/comissao/componentes/PaginaComissao.tsx` | **Corrigido** — primeiro barbeiro de `listarBarbeiros(unidadeId)` |
| `src/funcionalidades/barbeiro/componentes/PaginaBarbeiro.tsx` | **Corrigido** — `usuario.id` do `useSessao()` |

### Impacto

Telas de barbeiro/comissão usavam ID de demo. Com backend real, o barbeiro logado ou o primeiro da unidade é usado dinamicamente.

## `CLIENTE_DEMO_ID` (`client-ricardo`)

| Arquivo | Status |
|---------|--------|
| `src/funcionalidades/cliente/componentes/PaginaCliente.tsx` | **Parcial** — fallback quando `usuario.id` ausente |

### Próximo passo (opcional)

Remover `CLIENTE_DEMO_ID` quando fluxo de cliente autenticado estiver estável no backend.
