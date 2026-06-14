# Convenções Navalha Frontend

## Nomenclatura

| Artefato | Padrão | Exemplo |
|---|---|---|
| Pasta funcionalidade | kebab-case PT | `agendamento-publico/` |
| Componente React | PascalCase PT | `CartaoAgendamento.tsx` |
| Hook | camelCase `use` + PT | `useAgendamentosDoDia.ts` |
| Serviço API | kebab-case + `.servico.ts` | `agendamentos.servico.ts` |
| Tipo/interface | PascalCase PT | `Agendamento`, `StatusAgendamento` |
| Query key factory | `chavesConsulta*` | `chavesConsultaAgendamento` |

**Exceções (framework):** `page.tsx`, `layout.tsx`, `middleware.ts`, `loading.tsx`, `error.tsx`.

Copy de UI sempre em **pt-BR**.

## Anatomia de funcionalidade

```
funcionalidades/<nome>/
  componentes/
  hooks/
  esquemas/          # Zod (opcional)
  chaves-consulta.ts
  index.ts
```

## Fluxo de dados

```
page.tsx → Componentes → hooks → serviços → clienteApi
```

- Componentes **nunca** chamam `fetch` diretamente.
- Estados loading/erro/vazio: `EstadoCarregando`, `EstadoErro`, `EstadoVazio`.

## Regras de import

- `funcionalidades/A` **não importa** de `funcionalidades/B`.
- Cross-feature via `compartilhado/` ou callbacks na rota pai.
- Só entra em `compartilhado/` o que é usado por 2+ funcionalidades.

## Limites

- ~200 linhas por arquivo — dividir se passar.
- Uma responsabilidade por arquivo.

## Checklist de PR

- [ ] Tipos alinhados a `DATA_MODEL.md`
- [ ] Serviço + MSW handler juntos
- [ ] 3 temas testados
- [ ] Responsivo ≤980px
- [ ] Estados padronizados
