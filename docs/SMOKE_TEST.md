# Smoke test — Fase 1

Teste manual com backend real (`NEXT_PUBLIC_USAR_MOCKS=false`).

**Credenciais demo:** `dono@navalha.com` / `demo123`

## Pré-requisitos

- Backend local rodando em `http://localhost:3001`
- Frontend com `.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
  NEXT_PUBLIC_USAR_MOCKS=false
  ```

## Checklist

### 1. Login

| Campo | Valor |
|-------|-------|
| Passos | Abrir `/entrar` → preencher e-mail e senha → clicar Entrar |
| Resultado | _preencher_ |
| Print | ![Login](docs/prints/passo-1-login.png) |

### 2. Onboarding

| Campo | Valor |
|-------|-------|
| Passos | Após login, acessar `/onboarding` → percorrer passos |
| Resultado | _preencher_ |
| Print | ![Onboarding](docs/prints/passo-2-onboarding.png) |

### 3. Ver serviços

| Campo | Valor |
|-------|-------|
| Passos | Navegar até listagem de serviços (onboarding ou painel dono) |
| Resultado | _preencher_ |
| Print | ![Serviços](docs/prints/passo-3-servicos.png) |

### 4. Criar agendamento

| Campo | Valor |
|-------|-------|
| Passos | Fluxo de agendamento (recepção ou cliente) |
| Resultado | _preencher_ |
| Print | ![Agendamento](docs/prints/passo-4-agendamento.png) |

### 5. Abrir caixa

| Campo | Valor |
|-------|-------|
| Passos | Acessar `/recepcao/caixa` → verificar painel de caixa |
| Resultado | _preencher_ |
| Print | ![Caixa](docs/prints/passo-5-caixa.png) |

## Observações

_Adicione aqui bugs encontrados, telas que degradaram ok vs. crasharam._

## Prints

Salve screenshots em `docs/prints/` e atualize os links acima (ou adicione no README).
