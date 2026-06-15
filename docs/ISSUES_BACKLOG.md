# Issues do backlog — criar manualmente no GitHub

`gh` CLI não disponível nesta máquina. Crie em: https://github.com/Johnn216/Navalha-frontend/issues

No PR use `Closes #N` com os números reais.

| # | Título | Corpo sugerido |
|---|--------|----------------|
| A1 | Frontend não possui framework de testes | Instalar Vitest + Testing Library, scripts test, smoke test. |
| A2 | Testes dos componentes UI compartilhados | Testar Botao, Entrada, Cartao, Selo — mín. 6 testes. |
| A3 | Testes de formatadores e utilitários | Testar moeda, data-hora, permissoes — mín. 5 testes. |
| A4 | Testes dos schemas Zod de autenticação | Extrair esquemas e testar login/cadastro — mín. 4 testes. |
| B1 | CI do frontend no GitHub Actions | Workflow lint → test → build com mocks no CI. |
| C1 | Telas Fase 2 não devem derrubar o app | EstadoErro/Vazio em comissão, métricas, barbeiro, recepção. |
| C2 | IDs hardcoded documentados e corrigidos | docs/IDS_HARDCODED.md + usar dados da sessão/API. |
| C3 | Lint zerado no frontend | npm run lint sem erros. |
| C4 | Smoke test manual Fase 1 documentado | docs/SMOKE_TEST.md com checklist e prints. |
| D1 | README com seção de testes e badge CI | Documentar npm test e badge Actions. |
