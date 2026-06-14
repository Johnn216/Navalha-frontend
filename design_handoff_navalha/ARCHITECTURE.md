# Navalha — Arquitetura do Sistema

Documento de arquitetura para implementação. Os protótipos HTML não têm backend; tudo aqui é a especificação do sistema real a construir.

---

## 1. Visão de alto nível

Navalha é um **SaaS B2B multi-tenant** com um app **B2C** acoplado (agendamento do cliente final / marketplace).

```
                         ┌─────────────────────────────────────────┐
                         │              NAVALHA CLOUD               │
                         │                                          │
   Dono (web)  ─────────►│  API Gateway / Auth ──► Serviços/Módulos │
   Secretária (web) ────►│        │                    │           │
   Barbeiro (mobile) ───►│        ▼                    ▼           │
                         │   Postgres (multi-tenant)  Jobs/Filas    │
   Cliente (web/PWA) ───►│        │                    │           │
   Marketplace público ─►│        ▼                    ▼           │
                         │   Object Storage      Integrações ext.  │
                         └──────────────────────────│──────────────┘
                                                     ▼
                          WhatsApp Business API · Adquirentes (Stone/
                          Pagseguro/Cielo) · Pix (PSP) · NFS-e (prefeitura)
```

### Tenancy
- **Conta (Tenant) = uma rede/marca de barbearia.** Uma conta tem **N unidades** (lojas).
- O **Dono** é dono da conta e enxerga todas as unidades (multi-unidade/franquia, comparação lado a lado de até 12 unidades).
- **Barbeiro** e **Secretária** pertencem a uma ou mais unidades.
- **Cliente** é global ao tenant (pode frequentar várias unidades da mesma rede) e também existe no **marketplace público** cross-tenant.
- Isolamento: toda query carrega `tenant_id`; recomenda-se **Row-Level Security** no Postgres, ou schema-per-tenant se a escala exigir.

---

## 2. Stack recomendada (caso não exista codebase)

> Se já existe um codebase, ignore esta seção e use os padrões dele. Recrie os designs com a lib de UI já adotada.

| Camada | Recomendação | Por quê |
|---|---|---|
| **Web (Dono, Secretária, Cliente, Landing, Marketplace)** | **Next.js (App Router) + React + TypeScript** | SSR/SEO para landing e marketplace; mesma base para apps internos |
| **UI** | Tailwind CSS com os design tokens mapeados em `tailwind.config` + CSS variables por tema; Radix/shadcn para primitivos acessíveis | Reproduz tokens e troca de tema com `data-theme` |
| **Mobile (Barbeiro)** | **React Native (Expo)** ou PWA instalável | Barbeiro vive no celular; pode começar como PWA |
| **API** | **Node + TypeScript** (NestJS ou tRPC) ou **Postgres + Supabase/Hasura** | Tipagem ponta-a-ponta |
| **Banco** | **PostgreSQL** | Relacional, RLS multi-tenant, JSON quando preciso |
| **Realtime** | WebSocket / Supabase Realtime / Pusher | Recepção e caixa "ao vivo", badges de fila |
| **Filas/Jobs** | BullMQ / Redis (ou cron serverless) | Lembretes WhatsApp, score anti no-show, fechamento |
| **Storage** | S3-compatível | Fotos de portfólio, comprovantes PDF |
| **Auth** | JWT + refresh; OAuth opcional | Sessão por papel/tenant |

### Internacionalização & formato
- **Locale padrão `pt-BR`.** Moeda `R$` (`Intl.NumberFormat('pt-BR', {currency:'BRL'})`), datas `DD/MM`, timezone **America/Sao_Paulo**.
- Strings centralizadas (i18n) mesmo que só pt-BR no MVP.

---

## 3. Papéis & Permissões (RBAC)

| Papel | Acesso | Telas |
|---|---|---|
| **Dono / Admin** | Tudo no tenant; multi-unidade; financeiro; configura comissões, serviços, equipe, clube, fiscal | `dashboard.html` (+ todas as outras) |
| **Gerente de unidade** (variação do Dono, escopo a 1 unidade) | Igual ao Dono mas limitado à sua unidade | `dashboard.html` |
| **Secretária / Recepção** | Operação de 1 unidade: agenda consolidada, caixa, WhatsApp, fila, clientes, clube, equipe (leitura), estoque, notas | `secretaria.html` |
| **Barbeiro** | Própria agenda, próprios clientes, própria comissão/carteira, próprio portfólio/studio | `barbeiro.html` |
| **Cliente** | Próprios agendamentos, histórico, clube, fidelidade | `cliente.html` / `agendamento.html` |

Permissões devem ser **policy-based** (ex. `can(user, 'read', 'commission', {ownerId})`). Barbeiro só vê a própria comissão; Dono vê todas.

---

## 4. Módulos do sistema

Cada módulo = um bounded context. Mapeiam diretamente para as features da landing e para a navegação das telas.

1. **Auth & Tenancy** — contas, usuários, papéis, unidades, convites.
2. **Onboarding** — wizard de setup (6 passos): dados da barbearia → equipe → serviços → horários → integrações (WhatsApp/pagamento) → publicação. Salva progresso (auto-save), resumível.
3. **Catálogo (Serviços)** — serviços, preços, duração, categorias, combos.
4. **Equipe** — barbeiros, jornadas/turnos, regras de comissão, bloqueios (férias/almoço).
5. **Agenda & Booking** — slots, agendamentos, status, lista de espera, overbooking, link público, marketplace.
6. **Anti no-show (IA)** — score de risco por agendamento, sugestões de overbooking, bloqueio de clientes problemáticos. Ver `FUNCTIONS.md`.
7. **WhatsApp** — confirmações (24h/1h), reagendamento, caixa de entrada na recepção, templates oficiais.
8. **Caixa & Pagamentos** — recebimento Pix/cartão/dinheiro, troco, conciliação, fechamento do dia.
9. **Comissão** — cálculo por barbeiro/serviço/turno; regras (percentual, fixo, escalonado, por serviço); comprovante PDF. Ver `FUNCTIONS.md`.
10. **Financeiro (Dono)** — DRE, fluxo de caixa, comparação mês a mês, ranking de barbeiros, projeções, multi-unidade.
11. **Clientes (CRM)** — fichas, histórico com foto, preferências, status/segmento (ex. Platinum), regulares.
12. **Fidelidade** — programa "a cada 10 cortes, 1 grátis" (sem cartão de papel).
13. **Clube / Assinatura** — planos mensais, cartão recorrente, cobrança automática.
14. **Estoque** — produtos (pomada, navalha, óleo), níveis, alerta de baixo estoque.
15. **Fiscal & Relatórios** — NFS-e automática no fechamento, DRE/fluxo/SPED em PDF para o contador.
16. **Portfólio & Marketplace** — galeria pública por barbeiro, perfil público da barbearia, SEO, descoberta cross-tenant.
17. **Notificações** — push/WhatsApp/e-mail, badges em tempo real.

---

## 5. Integrações externas

| Integração | Uso | Notas |
|---|---|---|
| **WhatsApp Business API** (oficial) | Confirmação 24h/1h, reagendamento, inbox da recepção | Usar templates aprovados; sem gambiarra/não-oficial |
| **Adquirentes** Stone / Pagseguro / Cielo | Maquininha integrada no caixa | Abstrair atrás de um `PaymentProvider` |
| **Pix (PSP / banco)** | QR Code gerado na hora, conciliação automática | Webhook de confirmação |
| **NFS-e (prefeitura)** | Nota fiscal de serviço emitida no fechamento | Integração varia por município; isolar por provider |
| **Recorrência (clube)** | Cobrança de cartão recorrente | Tokenização de cartão (PCI: nunca armazenar PAN) |

Todas devem ficar atrás de **interfaces/adapters** para permitir mock em dev e troca de provider.

---

## 6. Realtime & Jobs

**Realtime (recepção/caixa/fila):**
- Badges "ao vivo" (Agenda `38`, WhatsApp `7`, Fila `5`) atualizam via socket.
- Status de agendamento (em atendimento, confirmado, pago) propaga para todos os painéis abertos.

**Jobs agendados / filas:**
- Lembrete WhatsApp 24h e 1h antes do horário.
- Recalcular **score anti no-show** quando muda histórico do cliente / proximidade do horário.
- Cobrança recorrente do clube (mensal).
- Fechamento de caixa (gera comissão, DRE do dia, NFS-e) — disparável "1 clique" + job de reconciliação.
- Marcar **no-show** automaticamente após tolerância e disparar regra (ex. cobrar taxa).

---

## 7. Segurança & Conformidade
- **LGPD**: dados de clientes (telefone, histórico, fotos) — consentimento, exportação, exclusão.
- **PCI**: nunca armazenar dados de cartão; usar tokenização do PSP.
- **Isolamento de tenant** em toda query (RLS).
- **Auditoria**: log de ações sensíveis (fechamento de caixa, alteração de comissão, exclusão de cliente).
- **Backups** diários do Postgres; storage versionado para comprovantes/NF.

---

## 8. Ordem de implementação sugerida (MVP → completo)

**Fase 1 — Núcleo operacional (MVP):**
1. Auth & Tenancy + Onboarding (passos 1–4)
2. Catálogo de Serviços + Equipe
3. Agenda & Booking + link público (`agendamento.html`)
4. App do Cliente básico (`cliente.html`)
5. Recepção + Caixa (`secretaria.html`)

**Fase 2 — Dinheiro:**
6. Comissão automática + Carteira do barbeiro (`barbeiro.html`)
7. Financeiro/DRE do Dono (`dashboard.html`)
8. Pagamentos (Pix/cartão) + fechamento

**Fase 3 — Crescimento:**
9. WhatsApp (confirmações + inbox)
10. Anti no-show (IA)
11. Clube/Assinatura + Fidelidade
12. Marketplace + Portfólio + SEO
13. Fiscal (NFS-e) + Estoque + Multi-unidade avançado

Ver `DATA_MODEL.md` para entidades, `FUNCTIONS.md` para a lógica de cada módulo e `API.md` para os endpoints.
