# Regras de Negócio — Portal de Aluguel de Carros

Este documento descreve todas as regras de negócio do portal, status, papéis, casos de borda e fluxos alternativos, de forma a permitir implementação sem ambiguidade.

---

## 1. Status do Sistema

### 1.1 Status de Veículo (`vehicles.status`)

| Valor        | Descrição |
|-------------|------------|
| `ACTIVE`    | Veículo disponível para aluguel. |
| `INACTIVE`  | Veículo fora de circulação; não pode ser reservado. |
| `MAINTENANCE`| Em manutenção; não pode ser reservado. |

- Apenas veículos com status **ACTIVE** podem ser alugados.

### 1.2 Status de Reserva (`bookings.status`)

| Valor      | Descrição |
|-----------|------------|
| `PENDING` | Aguardando aprovação do staff. |
| `APPROVED`| Aprovada pelo staff; reserva confirmada. |
| `REJECTED`| Rejeitada pelo staff. |
| `CANCELED`| Cancelada (pelo cliente ou fluxo de negócio). |

- Novas reservas **devem** ser criadas com status **PENDING**.
- Transições permitidas (regras detalhadas nas seções seguintes):
  - PENDING → APPROVED (apenas STAFF)
  - PENDING → REJECTED (apenas STAFF)
  - PENDING → CANCELED (cliente dono da reserva)
  - APPROVED → CANCELED (cliente dono da reserva)

### 1.3 Status de Usuário (`users.is_active`)

- `is_active = false`: usuário não pode fazer login ou realizar ações.
- Operações sensíveis **devem** verificar se o usuário está ativo.

---

## 2. Papéis do Sistema (RBAC)

| Papel    | Código  | Descrição |
|----------|---------|-----------|
| Cliente  | `CLIENT`| Usuário que aluga veículos; vê e cancela apenas suas reservas. |
| Staff    | `STAFF` | Administrador; gerencia veículos, clientes e aprova/rejeita reservas. |

- **CLIENT:** Pode listar veículos, consultar disponibilidade, criar reserva, listar/ver/editar/cancelar **apenas as próprias** reservas.
- **STAFF:** Pode CRUD de veículos, CRUD de clientes, listar todas as reservas, aprovar, rejeitar e editar reservas; **não** cancela reserva no lugar do cliente (cancelamento é ação de dono da reserva).

---

## 3. Regras de Negócio Detalhadas

### 3.1 Reserva de Veículo

Um veículo **não deve** ser reservado (criação de nova reserva) se:

1. **Estiver inativo:** `vehicles.status = 'INACTIVE'`.
2. **Estiver em manutenção:** `vehicles.status = 'MAINTENANCE'`.
3. **Houver conflito de datas:** Existir ao menos uma reserva do mesmo veículo com status `APPROVED` ou `PENDING` cujo intervalo `[start_date, end_date]` intercepte o intervalo solicitado (considerar inclusive as extremidades).

Além disso:

- **Datas devem ser válidas:** `start_date` e `end_date` no formato DATE; `start_date` **deve** ser menor ou igual a `end_date`.
- **Não permitir reservas retroativas:** `start_date` **deve** ser maior ou igual à data do dia (data atual do servidor), em termos de dia civil (sem considerar hora).
- **Cálculo do valor total:** Valor total da reserva = `daily_rate` do veículo × número de dias. Número de dias = `end_date - start_date + 1` (inclusive). O valor **pode** ser armazenado na reserva ou calculado sob demanda; se armazenado, **deve** ser consistente com a regra acima.
- **Reservas começam como PENDING:** Toda criação de reserva **deve** persistir com `status = 'PENDING'`.

### 3.2 Aprovação e Rejeição

- **Apenas STAFF** pode aprovar ou rejeitar reservas.
- **Apenas reservas com status PENDING** podem ser aprovadas ou rejeitadas.
- Ao aprovar, o sistema **deve** registrar `approved_by` (id do usuário STAFF) e `approved_at` (timestamp).
- Ao rejeitar, **pode** registrar `approved_by`/`approved_at` para auditoria (quem rejeitou e quando).
- Se na hora da aprovação houver conflito de datas (outra reserva aprovada/pendente no mesmo intervalo), **deve** rejeitar ou retornar erro e não aprovar.

### 3.3 Cancelamento

- **Apenas o CLIENT** que é dono da reserva **pode** cancelar essa reserva (ou seja, apenas o `customer_id` associado à reserva pode cancelar).
- STAFF **não** cancela reserva em nome do cliente; se necessário, pode haver fluxo futuro de “cancelamento administrativo” (fora do escopo desta regra).
- **Só podem ser canceladas** reservas em status **PENDING** ou **APPROVED**. Reservas já **REJECTED** ou **CANCELED** **não** podem ser canceladas novamente (retornar erro adequado).

### 3.4 Disponibilidade

- O endpoint de disponibilidade **deve** considerar reservas com status `APPROVED` e `PENDING` para indicar conflito (veículo ocupado naquele intervalo).
- Período consultado **deve** ser válido: `start <= end`, e preferencialmente não retroativo, conforme política do produto.

### 3.5 Clientes e Veículos

- **CRUD de clientes:** Apenas STAFF. Cliente (CLIENT) **pode** apenas ler e atualizar o próprio perfil (`/customers/me`).
- **CRUD de veículos:** Apenas STAFF. CLIENT e STAFF podem listar e ver detalhes de veículos.
- **Listagem de veículos:** Pode filtrar por status; para exibição ao cliente, **deve** considerar apenas `ACTIVE` ou documentar se inativos/em manutenção são exibidos para informação.

### 3.6 Autenticação e Autorização

- Registro (`/auth/register`) cria usuário com papel **CLIENT** e registro em `customers` (ou fluxo equivalente).
- Login retorna JWT com identificador do usuário e papel; **deve** ser usado em rotas protegidas.
- Rotas **devem** verificar papel (RBAC) conforme matriz de permissões do readme (e deste documento).

---

## 4. Casos de Borda

- **start_date = end_date:** Reserva de um único dia; **deve** ser permitida (número de dias = 1).
- **Múltiplas reservas PENDING para o mesmo veículo no mesmo período:** Na criação, **deve** ser bloqueado (conflito). Na aprovação, apenas uma **deve** ser aprovada; as demais **devem** permanecer PENDING ou serem rejeitadas conforme política (ex.: primeira aprovada vence; outras conflitantes retornam erro se staff tentar aprovar).
- **Cancelamento já cancelada:** Retornar erro (ex.: "Reserva já está cancelada") com código HTTP adequado (409 ou 422).
- **Aprovar reserva já aprovada/rejeitada/cancelada:** Retornar erro (ex.: "Apenas reservas pendentes podem ser aprovadas").
- **Cliente tenta cancelar reserva de outro cliente:** 403 Forbidden.
- **Data no passado:** Ao criar reserva, **não** permitir `start_date` no passado; retornar 422 com mensagem clara.
- **Veículo inexistente ou inativo/em manutenção:** Ao criar reserva, retornar 404 (veículo não existe) ou 422/409 (veículo não disponível para aluguel), com mensagem que permita ao cliente entender.
- **customer_id não corresponde ao usuário logado:** Em operações que envolvem “minha reserva”, **deve** validar que o booking pertence ao customer do usuário autenticado.

---

## 5. Fluxos Alternativos

### 5.1 Criação de reserva

- **Sucesso:** 201, retorna reserva com status PENDING.
- **Veículo inativo/manutenção:** 422, mensagem "Veículo não está disponível para aluguel".
- **Conflito de datas:** 409, mensagem indicando conflito no período.
- **Datas inválidas ou retroativas:** 422, detalhes por campo (start_date/end_date).
- **Veículo não encontrado:** 404.

### 5.2 Aprovação

- **Sucesso:** 200, retorna reserva com status APPROVED.
- **Reserva não encontrada:** 404.
- **Reserva não está PENDING:** 422, "Apenas reservas pendentes podem ser aprovadas".
- **Conflito ao aprovar:** 409, não aprovar e informar conflito.
- **Usuário não é STAFF:** 403.

### 5.3 Rejeição

- **Sucesso:** 200, retorna reserva com status REJECTED.
- **Reserva não encontrada:** 404.
- **Reserva não está PENDING:** 422.
- **Usuário não é STAFF:** 403.

### 5.4 Cancelamento

- **Sucesso:** 200, retorna reserva com status CANCELED.
- **Reserva não encontrada:** 404.
- **Reserva não é do cliente:** 403.
- **Reserva já cancelada ou rejeitada:** 422, "Esta reserva não pode ser cancelada".

### 5.5 Disponibilidade

- **Disponível:** 200, indicar que não há conflito no período (ex.: `available: true`).
- **Indisponível:** 200, indicar conflito (ex.: `available: false` e opcionalmente períodos ocupados).
- **Parâmetros inválidos (start/end):** 400 ou 422.

---

## 6. Fórmulas e Definições

- **Dias de reserva:** `dias = (end_date - start_date) em dias + 1` (inclusive).
- **Valor total:** `total = vehicle.daily_rate * dias`.
- **Conflito de datas:** Dois intervalos `[a, b]` e `[c, d]` conflitam se e somente se `a <= d` e `c <= b` (considerando datas inclusive).
- **Não retroativo:** `start_date >= data_hoje` (comparação por dia, sem hora).

---

Este documento deve ser a referência única para regras de negócio; qualquer conflito com outro artefato deve ser resolvido em favor deste arquivo, salvo ADR que altere explicitamente uma regra.
