# Navalha Frontend

SaaS para barbearias — Next.js 15, React 19, TypeScript, Tailwind.

## Desenvolvimento

```bash
cp .env.example .env.local
npm install
npm run dev
```

Demo login: `dono@navalha.com` / `demo123`

## Testes

[![Frontend CI](https://github.com/Johnn216/Navalha-frontend/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Johnn216/Navalha-frontend/actions/workflows/frontend-ci.yml)

```bash
npm test          # roda uma vez (Vitest)
npm test:watch    # modo watch
```

O CI no GitHub Actions executa, em cada push/PR na `main`:

1. `npm run lint`
2. `npm test`
3. `npm run build` (com `NEXT_PUBLIC_USAR_MOCKS=true`)

## Estrutura

- `src/app/` — rotas finas
- `src/funcionalidades/` — feature slices (PT)
- `src/compartilhado/` — design system, API, layouts
- `design_handoff_navalha/` — referência visual (não é código fonte)

## Documentação

- [docs/CONVENCOES.md](docs/CONVENCOES.md)
- [docs/INTEGRACAO_BACKEND.md](docs/INTEGRACAO_BACKEND.md)
- [docs/SMOKE_TEST.md](docs/SMOKE_TEST.md)
- [docs/IDS_HARDCODED.md](docs/IDS_HARDCODED.md)

## Deploy

Render: `render.yaml` incluído. Defina `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_USAR_MOCKS=false` em produção.
