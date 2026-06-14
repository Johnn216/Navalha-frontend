# Navalha Frontend

SaaS para barbearias — Next.js 15, React 19, TypeScript, Tailwind.

## Desenvolvimento

```bash
cp .env.example .env.local
npm install
npm run dev
```

Demo login: `dono@navalha.com` / `demo123`

## Estrutura

- `src/app/` — rotas finas
- `src/funcionalidades/` — feature slices (PT)
- `src/compartilhado/` — design system, API, layouts
- `design_handoff_navalha/` — referência visual (não é código fonte)

## Documentação

- [docs/CONVENCOES.md](docs/CONVENCOES.md)
- [docs/INTEGRACAO_BACKEND.md](docs/INTEGRACAO_BACKEND.md)

## Deploy

Render: `render.yaml` incluído. Defina `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_USAR_MOCKS=false` em produção.
