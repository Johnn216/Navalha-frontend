# Navalha — Especificação de Telas

Detalhamento de cada uma das 8 telas em `design_files/`. Para tokens (cores/fontes/raios) ver `README.md`. Para lógica de negócio ver `FUNCTIONS.md`.

**Padrões globais presentes em todas as telas:**
- **Troca de tema**: botões `[data-theme-btn]` (3 swatches) trocam `data-theme` no `<body>` e persistem em `localStorage['navalha-theme']`. Estado ativo via `aria-pressed="true"`.
- **Acessibilidade**: skip-link "Pular para o conteúdo", foco visível (`outline: 2px solid var(--accent)`), `aria-current="page"` na nav, `prefers-reduced-motion` desliga animações (barber pole, marquee).
- **Idioma**: pt-BR. Moeda R$, datas DD/MM, horários HH:MM em JetBrains Mono tabular.

---

## 1. `index.html` — Brand Guide
**Propósito:** referência interna do sistema de marca. Não é tela de produto, mas define o design system — útil para o desenvolvedor extrair tokens.

**Layout:** topbar sticky (grid 3 col: marca · nav · seletor de tema) com listra barber-pole animada embaixo. Conteúdo em `.wrap` (max 1280px). Seções numeradas `§ 01…§ 08` com `section-head` em grid 1fr/2fr.

**Seções:** Hero (selo SVG), Manifesto, Marca (selo/monograma/wordmark), Cor (3 temas + swatches que mostram hex ao vivo via JS), Tipografia (escala D1→Label), Voz (faça/evite), Motivos (pole/mármore/ticket/big numbers), Componentes (botões/badges/campos/card de agendamento/KPI), Aplicações, Roadmap (links para as outras telas), Footer.

**Interação:** seletor de tema atualiza os swatches e os valores hex exibidos (`#hex-bg`, `#hex-accent`, etc.) lendo `getComputedStyle`.

---

## 2. `landing.html` — Landing page (marketing)
**Propósito:** aquisição. Converte dono de barbearia para o trial de 14 dias.

**Seções (em ordem):**
1. **Topbar** + CTA "Começar agora →" (vai para `onboarding.html`).
2. **Hero** — grid 1.15fr/.85fr. Esquerda: eyebrow ("Novo · SaaS Brasileiro · 2026"), H1 "Sua barbearia, **afiada.**" (Cormorant clamp 64–132px), subtítulo itálico, 2 CTAs ("Testar grátis · 14 dias →" / "Ver demo ao vivo"), trust row (Setup 5min · Sem fidelidade · WhatsApp incluso · Suporte humano). Direita: **pilha de 3 tickets** rotacionados (agendamentos `#0142–#0144`) + marca d'água "N" gigante.
3. **Marquee** — faixa animada com features (Agenda inteligente · WhatsApp integrado · Comissão automática · …). Duplicada para loop sem emenda.
4. **Stats** — 4 colunas: R$ 4.280k faturamento/mês · 87% ocupação · −68% no-show · 12min setup. Números em Cormorant 76px.
5. **Como funciona** (§01) — 3 cards: Configure (12min) → Receba agendamentos (24/7) → Feche o caixa (1 clique).
6. **Recursos** (§02) — **bento grid 12 col**: Agenda IA anti no-show (big), WhatsApp, Comissão (com mini-bar chart), Pagamento, Multi-unidade, Clube, Portfólio+Marketplace (full, com tira de fotos), Estoque, Relatórios, Fiscal NFS-e, Produtividade.
7. **Para cada papel** (§03) — **abas** (`role-tab` data-role): Dono / Barbeiro / Secretária / Cliente. Cada aba tem painel com bullets + mock à direita (KPIs + lista). Aba ativa: `aria-pressed=true`, painel `.active`. Cada painel linka para a tela do papel.
8. **Depoimentos** (§) — 3 cards com citação + métrica.
9. **Pricing** (§) — 3 planos, toggle mensal/anual (com "save"), card "MAIS POPULAR" destacado.
10. **FAQ** — `<details>` acordeão (+/−).
11. **CTA final** + **Footer** (5 colunas).

**Interações:** abas de papel (mostra/esconde painel), toggle de preço (mensal/anual atualiza valores), FAQ nativo `<details>`, tema.

---

## 3. `onboarding.html` — Wizard de setup (6 passos)
**Propósito:** dono configura a barbearia em ~16min. Progresso salvo (auto-save), resumível.

**Layout:** grid `340px / 1fr`. **Esquerda (stepper sticky):** marca + lista ordenada de 6 passos com estados `done` (✓ accent) / `current` (anel accent) / pendente; cada passo tem título + tempo estimado; rodapé com link de ajuda e tag "salvo automaticamente" (verde, pulsando). **Direita (conteúdo do passo atual):** header (crumb "§ Passo 3 de 6 · Serviços" + título + lead) + editor + navegação.

**Os 6 passos:**
1. Dados da barbearia (2min) · 2. Equipe (3min) · 3. **Serviços** (5min, passo atual no mock) · 4. Horários (4min) · 5. Integrações WhatsApp/pagamento (2min) · 6. Publicar.

**Passo 3 (mostrado):** banner de importação (planilha/sistema antigo), lista de serviços selecionáveis com preço e duração editáveis (toggle de seleção), botão adicionar. Botão "Próximo" (`.next`) — no protótipo dispara `alert` de simulação; na produção avança e persiste.

**Estados:** passo concluído fica `done`; conector entre passos vira accent quando o anterior está done.

---

## 4. `dashboard.html` — Painel do Dono (desktop)
**Propósito:** gestão e financeiro do negócio; multi-unidade.

**Layout:** grid `240px / 1fr`. **Sidebar** (sticky, full-height): marca · **seletor de unidade** (dot + nome + meta + seta) · nav em seções (Visão geral, Financeiro, Operação, Equipe, Crescimento, Sistema) com glifos e badges numéricas · rodapé com avatar do usuário (nome + papel). Item ativo: borda-esquerda accent + fundo tingido.

**Main:** topbar (busca com atalho `/`, pills "ao vivo", ícones de notificação com dot, seletor de tema compacto) → **page-head** (crumb + H1 "Visão **geral**" + subtítulo + ações: date-picker Diário/Semanal/Mensal, exportar, novo).

**Conteúdo:**
- **KPI grid** (4 col): Receita do mês (R$ 42,8k, +24%), Ocupação (87%), Ticket médio, No-show — cada KPI com label mono, valor grande Cormorant, delta colorido e mini-sparkline.
- **Gráfico de faturamento** (barras, 12 meses) com `card-tools` (Diário/Semanal/Mensal toggle).
- **Ranking de barbeiros** (lista com posição ★, nome, R$/cortes/ocupação, delta).
- **Comparação de unidades** (multi-loja lado a lado).
- Demais cards: fluxo de caixa, projeções, atividades recentes.

**Interações:** date-picker e card-tools fazem toggle visual (`aria-pressed`); seletor de unidade abre dropdown (a implementar); tema; busca.

---

## 5. `secretaria.html` — Painel da Secretária / Recepção (desktop)
**Propósito:** operação ao vivo da recepção de **uma** unidade.

**Layout:** mesmo shell de sidebar+main do dashboard, mas nav focada em operação:
- **Operação:** Recepção (ativo), Agenda `38` (badge live), Caixa, WhatsApp `7` (badge live).
- **Clientes:** Clientes, Fila `5`, Clube.
- **Serviço:** Equipe, Estoque, Notas.
- **Sistema:** Configurações, ← Brand.

**Tela Recepção (default):** topbar com H1 "Recepção · agora" + timestamp "Quinta · 21/OUT · 14:32". Conteúdo: KPIs ao vivo (3 em atendimento, 5 na fila, R$ 840 caixa), **agenda consolidada de todos os barbeiros** (colunas por barbeiro, cores por serviço), **inbox WhatsApp** embutido (confirmações/reagendamentos), **fila de espera** com próximo encaixe, ações de caixa (receber Pix/cartão/dinheiro, troco, fechar).

**Realtime:** badges (`live`) e KPIs atualizam via socket. Status de pagamento propaga.

---

## 6. `barbeiro.html` — App do Barbeiro (mobile)
**Propósito:** o barbeiro vê o dia inteiro em uma tela, no celular.

**Layout:** mockup de telefone centralizado entre dois painéis editoriais (esquerda: "Foco no corte"; direita: "Barber moderno"). Dentro do telefone: conteúdo + **tab bar** inferior com 5 abas (`data-tab`): **Hoje** (default) · **Agenda** · **Clientes** · **Carteira** · **Studio**.

**Abas:**
- **Hoje:** saudação, KPIs (8 cortes hoje, R$ 384 comissão, 2 próximos), lista de agendamentos do dia (horário, cliente, serviço, ficha "regular há 8m"/"1ª vez", status Agora/Pago/Confirmado).
- **Agenda:** visão semanal/mensal própria; bloquear horários (férias/almoço/reunião).
- **Clientes:** fichas com foto do último corte e preferências.
- **Carteira:** comissão acumulada em tempo real, histórico, extrato/comprovante.
- **Studio:** portfólio público — postar corte, ver curtidas, ganhar cliente via marketplace.

**Interação:** trocar de aba (`tab-btn` → `aria-pressed`, mostra painel correspondente). Comissão atualiza ao vivo.

---

## 7. `cliente.html` — App do Cliente (mobile) + Marketplace
**Propósito:** agendar em 3 cliques; sem cadastro chato.

**Layout:** telefone central entre painel "Em três cliques" (esq.) e "Marketplace" (dir.). Fluxo de booking dentro do app:
- **Passo 1 · Serviço** → **Passo 2 · Barbeiro** (favorito) → **Passo 3 · Horário** ("Qual **horário**?") → confirmação.
- **Home do cliente:** próximo agendamento, histórico de cortes **com foto** ("o mesmo da última vez" com 1 toque), cartão de fidelidade (8/10 para grátis), status (Platinum), clube de assinatura.
- **Marketplace (painel direito):** cada barbearia tem perfil público com fotos, barbeiros, avaliações; cliente agenda direto sem login.

---

## 8. `agendamento.html` — Booking público (sem login)
**Propósito:** fluxo de agendamento acessível por link público / marketplace / Instagram / Google.

**Fluxo (seleção sequencial):**
1. **Serviço** — lista `.svc-row` (clicável; seleção única, classe `selected`).
2. **Barbeiro** — cards `.barber-card` (seleção única).
3. **Data** — calendário `.cal-day` (dias `.muted` desabilitados; seleção única).
4. **Horário** — grade `.time-slot` (slots `.taken` indisponíveis; seleção única).
5. **Confirmação** — resumo (serviço, barbeiro, data, hora, valor) + dados do cliente (nome, telefone) + confirmar.

**Interações:** cada etapa é seleção única que destaca o item (`.selected`) e habilita a próxima. Resumo/total recalcula conforme escolhas. Tema disponível no rodapé.

---

## Responsividade (todas as telas)
- Breakpoint principal **≤980px** (alguns ≤1080px): grids de 2+ colunas colapsam para 1 coluna; `tb-center` (nav central) some; bento de 12 col vira 6; sidebar do onboarding vira stepper horizontal scrollável.
- Apps de barbeiro/cliente já são mobile-first (mockup de telefone) — na produção, são a tela cheia no celular.
- Hit targets mínimos 44px; inputs com foco accent.
