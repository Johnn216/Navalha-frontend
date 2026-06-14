# Navalha — Funções & Lógica de Negócio

Como o sistema *funciona* por dentro. Cada seção descreve regras, fórmulas e pseudocódigo dos módulos. Pareie com `DATA_MODEL.md` (entidades) e `API.md` (endpoints).

> Dinheiro sempre em **centavos (int)**. Datas em timezone da unidade (`America/Sao_Paulo`).

---

## 1. Agenda & disponibilidade

**Gerar slots disponíveis** para (unidade, barbeiro, data, serviço):
```
1. Pega WorkShifts do barbeiro no weekday da data → janelas de trabalho.
2. Remove TimeBlocks (férias/almoço/reunião) que interceptam.
3. Remove Appointments existentes (status em CONFIRMED/IN_SERVICE/PENDING) → ocupado.
4. Fatia as janelas livres em passos = duration_min do serviço (com buffer opcional).
5. Marca slot como TAKEN se conflita; senão AVAILABLE.
6. (Opcional) injeta slots OVERBOOK sugeridos pela IA (ver §3).
```
Regras: não permitir agendar no passado; respeitar antecedência mínima; um barbeiro = um atendimento por vez (sem sobreposição, exceto overbook explícito).

**Lista de espera (waitlist):** quando não há slot, cliente entra como `WAITLIST`. Em um `CANCELED`/`NO_SHOW` que libera horário compatível → notifica o primeiro da fila (WhatsApp) e oferece encaixe. A recepção (`secretaria.html`) vê "próximo encaixe: 14:50".

---

## 2. Booking público (3 cliques) — `agendamento.html` / `cliente.html`
```
selecionarServiço → selecionarBarbeiro → selecionarData → selecionarHorário → confirmar
```
- Cada etapa filtra a próxima (serviço define duração; barbeiro define agenda; data define slots).
- `source` do Appointment = `PUBLIC_LINK` | `MARKETPLACE` | `CLIENT_APP` | `WHATSAPP`.
- Cliente identificado por **telefone**; se novo, cria `Client` on-the-fly (sem cadastro pesado).
- Ao confirmar: cria Appointment `PENDING`, calcula `no_show_risk` (§3), dispara confirmação WhatsApp (§5), retorna comanda `#código`.

---

## 3. IA Anti No-show

**Objetivo:** prever quem vai faltar e reduzir no-show (meta −68%). Saída: `appointment.no_show_risk ∈ [0,1]`.

**Sinais (features):**
- `client.no_show_count` / `total_visits` (taxa histórica de falta).
- Antecedência do agendamento (muito em cima da hora ↑ risco; muito longe ↑ risco).
- Horário/dia (faixas historicamente faltosas).
- Primeira vez vs. regular (`segment`).
- Confirmou no WhatsApp? (confirmação ↓ risco fortemente).
- Histórico de cancelamento de última hora.

**MVP (sem ML):** score heurístico ponderado, ex.:
```
risk = clamp(
   0.45 * histNoShowRate(client)
 + 0.20 * (1 - confirmedFactor)      // confirmou=0, não=1
 + 0.15 * leadTimeRisk(starts_at)
 + 0.10 * firstVisitFactor
 + 0.10 * slotRisk(weekday,hour),
 0, 1)
```
**Evolução:** treinar classificador (logistic/GBM) com histórico real; recalcular via job quando muda confirmação ou se aproxima o horário.

**Ações derivadas do score:**
- `risk ≥ 0.6` → mostra badge "RISCO 24%"; sugere **overbooking seguro** (slot `OVERBOOK` no mesmo horário) e reforça lembrete.
- Cliente com `no_show_count` alto → pode ser `blocked` (regra do dono) e exigir confirmação/sinal.
- Marcação automática de `NO_SHOW` após tolerância (job) → incrementa contador, pode cobrar taxa (ex. R$ 20).

A landing exibe "15:30 · RISCO 24%" e "16:00 · OVERBOOK" — esse é o output visual esperado na agenda.

---

## 4. Comissão automática

**Regras (`CommissionRule`)** por escopo, com prioridade. Tipos:
- `PERCENT` — % sobre o valor do serviço (ex. 40%).
- `FIXED` — valor fixo por atendimento.
- `PER_SERVICE` — % ou fixo específico por serviço.
- `TIERED` (escalonado) — faixas por faturamento do período (ex. até R$ 5k = 40%, acima = 50%).

**Resolução de regra** para um `AppointmentItem`:
```
regras = rules where scope matches (service > barber > unit > global), status ativo
escolhe a de maior priority (mais específica vence)
```

**Cálculo (no momento do PAID ou no fechamento):**
```
para cada AppointmentItem do appointment PAID:
    base = item.price_cents
    rule = resolveRule(item)
    switch rule.type:
        PERCENT:     amount = round(base * rule.value.percent)
        FIXED:       amount = rule.value.fixed_cents
        PER_SERVICE: amount = perServiceAmount(item, rule)
        TIERED:      amount = tier(base, barberPeriodTotal, rule.value.tiers)
    cria CommissionEntry(appointment, barber, base, rule, amount, period=mês, status=ACCRUED)
```
- **Carteira do barbeiro** (`barbeiro.html` › Carteira) = soma de `CommissionEntry` ACCRUED do período, atualizada em tempo real (mock: "R$ 384" hoje, "8 cortes").
- **Comprovante PDF** por barbeiro/período para o contador.
- No fechamento ou ciclo de pagamento, entries viram `PAID`.

---

## 5. WhatsApp (confirmações & inbox)

**Confirmações automáticas (jobs):**
- **24h antes**: template "lembrete" com botão **Confirmar**.
- **1h antes**: reforço.
- Resposta do cliente (`IN`) com confirmação → Appointment `CONFIRMED`, `confirmedFactor=1`, recalcula `no_show_risk`.

**Inbox da recepção** (`secretaria.html` › WhatsApp, badge `7`): mensagens entrantes, reagendamento, dúvidas — tudo sem sair do painel. Usar **WhatsApp Business API oficial** com templates aprovados.

Estados de mensagem: `SENT → DELIVERED → READ → REPLIED`.

---

## 6. Caixa & Pagamentos

**Sessão de caixa (`CashSession`)** por unidade/dia: abre com `opening_float` (fundo de troco), acumula `Payment`s, fecha com contagem.

**Receber pagamento:**
```
método ∈ {PIX, CARD, CASH}
PIX  → gera QR Code na hora (PSP); webhook confirma → status PAID, reconciled=true
CARD → maquininha integrada (Stone/Pagseguro/Cielo); retorno do adquirente → PAID
CASH → registra amount + troco (change = recebido - devido)
ao PAID: Appointment → PAID, dispara Comissão (§4), Fidelidade (§7), elegível NFS-e (§9)
```

**Fechamento do dia (1 clique):**
```
expected = Σ payments da sessão por método
counted  = contagem informada (dinheiro)
diff     = counted - (opening_float + expected_cash)
gera: comissões consolidadas, DRE do dia, NFS-e pendentes
fecha CashSession (status CLOSED)
```
Conciliação automática casa Pix/cartão com os recebíveis.

---

## 7. Fidelidade ("10 cortes → 1 grátis")

`LoyaltyCard` por cliente: `stamps` 0–10.
```
ao Appointment PAID:
    card.stamps += 1
    se card.stamps >= card.target (10):
        card.stamps -= 10
        card.rewards_available += 1   // próximo corte grátis
```
- UI do cliente mostra "8 / 10 para grátis" (visto no protótipo).
- Resgate: aplica desconto de 1 serviço elegível; sem cartão de papel.

---

## 8. Clube / Assinatura

`Plan` (mensal) + `Subscription` por cliente com `card_token` e `next_charge_at`.
```
job mensal:
    para cada Subscription ACTIVE com next_charge_at <= hoje:
        cobra card_token (PSP recorrente)
        sucesso → next_charge_at += 1 mês
        falha → status PAST_DUE, notifica, retenta (dunning)
```
Benefícios (jsonb) ex.: "corte mensal incluso", descontos. Cancelamento livre.

---

## 9. Fiscal (NFS-e) & Relatórios

- **NFS-e**: ao fechar caixa (ou por agendamento PAID), gera nota de serviço via integração da **prefeitura** do município (varia por cidade → adapter por provider). `Invoice` com `pdf_url` e `status`.
- **Relatórios do contador** (1 clique, PDF): **DRE**, **fluxo de caixa**, **SPED**. Comparação mês a mês.

---

## 10. Financeiro & métricas do Dono (`dashboard.html`)

Fórmulas dos KPIs:
- **Receita do mês** = Σ `Payment.amount` PAID no período (por unidade ou consolidado).
- **Ticket médio** = receita / nº de atendimentos PAID.
- **Ocupação** = minutos agendados / minutos disponíveis (WorkShifts − TimeBlocks) no período. (Mock: 87%.)
- **Delta vs mês anterior** = (atual − anterior) / anterior. (Mock: +24%.)
- **No-show rate** = NO_SHOW / total agendado.
- **Ranking de barbeiros**: ordena por receita; mostra cortes, ocupação, retenção, delta.
- **Multi-unidade**: mesmas métricas por unidade, comparáveis lado a lado (até 12).
- **Retenção de cliente**: % de clientes que retornam em janela (ex. 60 dias).

---

## 11. Estoque

`Product` com `qty` e `min_qty`. Baixa de estoque manual ou vinculada a serviço/venda. Quando `qty <= min_qty` → **alerta** (badge/notificação) "vai acabar". Visível em `secretaria.html › Estoque`.

---

## 12. Onboarding (setup resumível)

Wizard de 6 passos com **auto-save** por passo (persistir parcial no servidor). Estado: `done` / `current` / pendente. Importação de serviços/clientes a partir de planilha (CSV/XLSX) ou sistema antigo. Conclusão do passo 6 (**Publicar**) liga `unit.public_booking_enabled` e o perfil no marketplace.

---

## 13. Marketplace & Portfólio

- **Perfil público da barbearia** (`unit.slug`): fotos, barbeiros, serviços, avaliações, botão agendar → `agendamento.html`.
- **Portfólio do barbeiro** (`barber.public_slug`): grade de `PortfolioPost` (foto do corte, serviço, curtidas). Postado pelo barbeiro no Studio.
- **Descoberta cross-tenant** com **SEO** (SSR): cliente acha a barbearia sem a barbearia ter site próprio.
- **Avaliações** (`Review`) alimentam `rating_avg` do barbeiro/unidade.
