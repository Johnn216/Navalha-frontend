# Navalha Frontend

SaaS para barbearias — agenda, caixa, comissão e operação integrada. Projeto desenvolvido no bootcamp em dupla, com frontend em Next.js e backend hospedado no Render.

## Demonstração visual

> Coloque as screenshots em `docs/prints/` com os nomes abaixo.

### Foto 1 — Tela inicial

<img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/3a67ccc8-c1db-4b0e-86a3-fbf92cec178d" />


Landing page / entrada do sistema.

### Foto 2 — Login

<img width="1919" height="900" alt="image" src="https://github.com/user-attachments/assets/f170e988-10d5-488c-b073-a470866f2749" />


Acesso com credenciais demo (ver seção Login demo).

### Foto 3 — Painel admin (dono)

<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/e54d1b10-8396-4808-ba61-d4abfeefcbb4" />


Visão geral do dono/gestor após autenticação.

---

## Sobre o projeto

O **Navalha** é uma plataforma para gestão de barbearias: agendamentos, recepção, caixa, métricas e fluxos por papel (dono, recepção, barbeiro, cliente).

| Repositório | Responsabilidade |
|-------------|------------------|
| **Navalha-frontend** (este) | Interface, testes, CI, integração com API |
| **Navalha-backend** | API REST, Supabase, deploy no Render |

### Ferramentas de desenvolvimento

Parte do planejamento, organização do backlog, testes e implementação foi feita com apoio de **Cursor** e **Claude** (IA assistente), sempre com revisão e merge humanos no GitHub. O código final passa por code review entre os integrantes da dupla.

---

## Aviso — lentidão em produção

O backend está no **Render (plano free)**. Se o sistema **demorar para responder** (login, listagens, etc.), isso pode ser normal:

- O servidor **hiberna** após inatividade e pode levar **30–60 segundos** (ou mais) para voltar no primeiro acesso.
- Após esse "cold start", as próximas requisições tendem a ficar mais rápidas.

Se a primeira tentativa de login falhar ou ficar carregando, **aguarde um pouco e tente novamente**.

---

## Stack

- **Next.js 15** · **React 19** · **TypeScript**
- **Tailwind CSS** · **TanStack Query** · **Zod** · **MSW** (mocks em dev)
- **Vitest** + **Testing Library** (testes)
- **GitHub Actions** (CI)

---

## Desenvolvimento local

```bash
cp .env.example .env.local
npm install
npm run dev
