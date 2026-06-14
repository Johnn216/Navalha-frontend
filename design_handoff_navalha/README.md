# Handoff: Navalha — Sistema Operacional para Barbearias

> **SaaS multi-unidade para barbearias brasileiras.** Do agendamento ao caixa, da comissão automática ao clube de assinatura.

Este pacote é o **handoff completo** para implementar o Navalha em um codebase real usando Claude Code. Ele documenta a arquitetura, o modelo de dados, cada tela, a lógica de negócio (funções) e a API. Um desenvolvedor que não participou da conversa de design deve conseguir construir o produto a partir destes documentos.

---

## 📁 Como ler este pacote

| Arquivo | O que contém |
|---|---|
| **README.md** (este) | Visão geral, fidelidade, design tokens, índice |
| **ARCHITECTURE.md** | Stack recomendada, módulos, multi-tenancy, auth, papéis/permissões, infra |
| **DATA_MODEL.md** | Todas as entidades, campos, relacionamentos e schema SQL sugerido |
| **SCREENS.md** | Spec tela-a-tela: layout, componentes, copy, estados, interações |
| **FUNCTIONS.md** | Lógica de negócio: comissão, anti no-show (IA), caixa, fidelidade, clube, fiscal |
| **API.md** | Superfície REST por módulo (endpoints, payloads, regras) |
| **design_files/** | Os 8 protótipos HTML de referência (o design "verdade") |

---

## Overview

**Navalha** é o sistema operacional de gestão para barbearias. Resolve o ciclo inteiro de operação de uma barbearia moderna brasileira:

- **Agendamento** — link público, marketplace, WhatsApp, IA anti no-show
- **Operação de recepção** — agenda consolidada, fila, caixa unificado (Pix/cartão/dinheiro)
- **Gestão do dono** — financeiro, DRE, ranking de barbeiros, multi-unidade/franquia
- **Trabalho do barbeiro** — agenda do dia, comissão em tempo real, portfólio público
- **Cliente final** — agendar em 3 cliques, histórico com foto, clube de assinatura, fidelidade

São **4 papéis** (Dono, Barbeiro, Secretária/Recepção, Cliente) sobre **uma base multi-tenant** (uma conta = uma rede de barbearias, com N unidades).

## About the Design Files

Os arquivos em `design_files/` são **referências de design feitas em HTML** — protótipos que mostram o visual e o comportamento pretendidos, **não código de produção para copiar diretamente**.

A tarefa é **recriar esses designs no ambiente do codebase alvo** (React/Next, Vue, Flutter, React Native, etc.), usando os padrões e bibliotecas já estabelecidos nesse projeto. **Se ainda não existe um codebase**, escolha a stack recomendada em `ARCHITECTURE.md` e implemente os designs lá.

Os protótipos HTML usam apenas HTML/CSS/JS vanilla com troca de tema via `localStorage` e estados visuais (seleção, abas). Eles **não** têm backend, persistência real, autenticação ou integrações — tudo isso está especificado para você construir, em `ARCHITECTURE.md`, `DATA_MODEL.md`, `FUNCTIONS.md` e `API.md`.

## Fidelity

**Hi-fi (alta fidelidade).** Os protótipos são mockups refinados com cores finais, tipografia, espaçamento e micro-interações definidos. Recrie a UI **pixel-perfect** usando as bibliotecas e o design system do codebase. Todos os valores exatos (cores hex, escalas de fonte, raios, sombras) estão na seção **Design Tokens** abaixo e em `SCREENS.md`.

---

## Design Tokens

O produto tem **3 temas oficiais** que o cliente (dono da barbearia) escolhe. Todos compartilham a mesma estrutura de tokens — só mudam os valores. Tema padrão: **Clássico**. Persistido em `localStorage` na chave `navalha-theme` (`classico` | `moderno` | `terra`), aplicado via atributo `data-theme` no `<body>`.

### Tema 01 · Clássico (padrão) — "preto profundo, latão, creme"
| Token | Hex | Papel |
|---|---|---|
| `--bg` | `#0F0D0A` | Fundo base |
| `--bg-soft` | `#15120E` | Superfície / card |
| `--bg-elev` | `#1C1813` | Elevado / hover |
| `--bg-card` | `#18140E` | Card alternativo (dashboard) |
| `--ink` | `#F2EBDC` | Texto principal (creme) |
| `--ink-soft` | `#C9C0AC` | Texto secundário |
| `--ink-mute` | `#8A8170` | Texto terciário / labels |
| `--rule` | `#2A241B` | Bordas / divisores |
| `--rule-soft` | `#1F1A14` | Borda sutil |
| `--accent` | `#C9A35E` | Marca / latão (brass) |
| `--accent-soft` | `#8C6F3A` | Latão escuro |
| `--accent-ink` | `#0F0D0A` | Texto sobre accent |
| `--hl` | `#E8C97A` | Highlight / hover do accent |
| `--ok` | `#7BA776` | Status sucesso |
| `--danger` | `#C9533E` | Status erro / no-show |
| `--warn` | `#D9A04A` | Status alerta |

### Tema 02 · Moderno — "midnight, teal elétrico, branco frio" (barber-tech)
`--bg:#0B1116` · `--bg-soft:#11181F` · `--bg-elev:#182028` · `--bg-card:#131B23` · `--ink:#ECF1F4` · `--ink-soft:#B6C2CB` · `--ink-mute:#6E7C86` · `--rule:#1F2A33` · `--rule-soft:#172029` · `--accent:#00C896` · `--accent-soft:#027E60` · `--accent-ink:#08110D` · `--hl:#2DE3B1`

### Tema 03 · Terra — "creme, mata, tabaco, carvão" (studio artesanal, tema claro)
`--bg:#F1ECE3` · `--bg-soft:#E8E1D2` · `--bg-elev:#FFFFFF` · `--bg-card:#FAF6EE` · `--ink:#1A1614` · `--ink-soft:#4A413A` · `--ink-mute:#7A6F62` · `--rule:#D5CCB9` · `--rule-soft:#E1D9C6` · `--accent:#2A4A3B` · `--accent-soft:#8B5A2B` · `--accent-ink:#F1ECE3` · `--hl:#C46A2A` · `--ok:#3D6B4E` · `--danger:#A8442E`

> **Implementação recomendada:** defina os tokens como CSS custom properties em `:root` e sobrescreva com seletores `[data-theme="moderno"]` / `[data-theme="terra"]`. Em React, exponha um `ThemeProvider` que troca o atributo e persiste a escolha. Todos os pares texto/fundo mantêm contraste mínimo **AA**.

### Tipografia
Três famílias (Google Fonts), com papéis distintos:

| Família | Papel | Uso |
|---|---|---|
| **Cormorant Garamond** (serif) | Display & editorial | Títulos, nomes, citações, números grandes de marca. Pesos 400–700 + itálico. |
| **Bricolage Grotesque** (sans) | Produto / corpo | Botões, parágrafos, formulários, UI geral. Pesos 300–700. |
| **JetBrains Mono** (mono) | Técnico / numérico | Horários, comissões, IDs, labels, KPIs tabulares. Pesos 400–600. |

**Escala (px / line-height):**
| Token | Família | Tamanho / LH | Notas |
|---|---|---|---|
| Display D1 | Cormorant 500 italic | `120 / .92` | letter-spacing -.01em |
| Display D2 | Cormorant 500 | `80 / 100` | hero/section, usa `clamp()` |
| H1 | Cormorant 600 | `48–56 / 1.0–1.05` | títulos de página (itálico no destaque) |
| H2 | Bricolage 600 | `26 / 34` | seção |
| Body | Bricolage 400 | `16 / 26` (UI 13–14) | parágrafos |
| Label/UI | JetBrains Mono 500 | `10–12` · tracking `.18–.22em` · UPPERCASE | labels, eyebrows |
| Data | JetBrains Mono 500 | `22` · `font-variant-numeric: tabular-nums` | valores monetários, % , IDs |

### Espaçamento, raios, sombras
- **Grid container:** `max-width: 1280px`, padding lateral `48px` (desktop) / `24px` (≤980px).
- **Gaps comuns:** 16px (cards), 24–32px (seções), 64px (section-head em 2 colunas).
- **Border radius:** `999px` (botões CTA / pills), `12px` (cards grandes/price), `8px` (cards padrão), `6px` (botões de app, inputs, KPIs), `4px` (badges, chips, time slots), `3px` (badge pequeno).
- **Sidebar dashboard:** largura `--sidebar-w: 240px`.
- **Sombras:** suaves, baseadas no accent — ex. `0 30px 80px -30px color-mix(in oklab, var(--accent) 40%, transparent)`; tickets `0 30px 80px -20px rgba(0,0,0,.6)`.
- **Foco (a11y):** `outline: 2px solid var(--accent); outline-offset: 2–3px` em todos os interativos.

### Motivos visuais (vocabulário de marca)
Usar com parcimônia — dão o tom "barbearia clássica × dashboard moderno":
1. **Barber pole** — listras diagonais animadas (`repeating-linear-gradient(-45deg, ...)`). Usado em loaders, bordas, divisores. Tem animação `pole 14s linear infinite` (respeitar `prefers-reduced-motion`).
2. **Mármore** — fundo com gradientes radiais. Hero, telas de login.
3. **Ticket / comanda** — card com "picote" (dashed border + máscara de entalhe nas laterais). Agendamentos, recibos, comandas.
4. **Big numbers** — numerais grandes em mono. KPIs, contadores, IDs.
5. **Selo / emblema** — brasão circular com `textPath` (NAVALHA · BARBER SYSTEM · EST. MMXXVI). Splash, cobertura, cartão.
6. **Monograma "N"** — Cormorant itálico. App icon, favicon, avatar.

### Iconografia
Os protótipos usam **glifos de letra** (A/W/C/$/M/K/etc.) dentro de quadrados arredondados como placeholders de ícone — **não** são o design final. No codebase, substitua por um icon set real (ex. Lucide, Phosphor) mantendo o container quadrado `22–32px` com borda `1px var(--rule)`.

---

## Files (protótipos de referência em `design_files/`)

| Arquivo | Tela | Papel |
|---|---|---|
| `index.html` | Brand Guide | Sistema de marca completo (tokens, tipografia, voz, componentes) |
| `landing.html` | Landing page | Marketing / aquisição |
| `onboarding.html` | Onboarding | Wizard de setup da barbearia (6 passos) |
| `dashboard.html` | Painel do Dono | Gestão / financeiro / multi-unidade (desktop, sidebar) |
| `secretaria.html` | Painel da Secretária | Recepção / caixa / WhatsApp / fila (desktop, sidebar) |
| `barbeiro.html` | App do Barbeiro | Agenda, comissão, clientes, carteira, studio (mobile) |
| `cliente.html` | App do Cliente | Agendar em 3 cliques + marketplace (mobile) |
| `agendamento.html` | Booking público | Fluxo de agendamento sem login (serviço→barbeiro→data→hora) |

> Veja `SCREENS.md` para o detalhamento de cada uma.

## Assets

Nenhum asset binário é necessário para o MVP — toda a UI é construída com CSS, tipografia (Google Fonts) e SVG inline (selo/emblema). **Imagens reais necessárias na produção** (substituir placeholders):
- Fotos de portfólio dos barbeiros (cortes) — galeria e marketplace.
- Avatares de cliente/barbeiro.
- Logo final da marca (o selo SVG dos protótipos serve de base).

Fontes: importar via Google Fonts (`Cormorant+Garamond`, `Bricolage+Grotesque`, `JetBrains+Mono`) ou self-host.
