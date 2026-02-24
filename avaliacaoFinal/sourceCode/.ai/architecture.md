# Arquitetura do Sistema — Portal de Aluguel de Carros

Este documento descreve a arquitetura em camadas (MVC + Service + Repository), os fluxos principais e as decisões arquiteturais (ADRs).

---

## 1. Arquitetura do Sistema: MVC + Service + Repository

O backend segue uma arquitetura em camadas com responsabilidades bem definidas:

- **Controller (MVC):** Recebe a requisição HTTP, valida entrada (ou delega à camada de validação), chama o **Service** e devolve a resposta formatada. Não contém regras de negócio nem acesso a dados.
- **Service:** Contém toda a **lógica de negócio**. Orquestra operações, aplica regras (disponibilidade, papéis, estados) e chama **Repositories** para persistência. Pode chamar outros services quando necessário.
- **Repository:** Única camada que acessa o armazenamento (MySQL ou mock em memória). Expõe métodos como `findById`, `create`, `update`, `findByVehicleAndDateRange`, etc. Não contém regras de negócio.

Fluxo de dados: **Request → Controller → Service → Repository → DB** (e volta).

---

## 2. Diagrama Textual de Camadas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (Browser)                               │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP (REST, JSON)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXPRESS (Node.js API)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Middlewares │  │   Routes    │  │ Validations │  │ Error Handler   │  │
│  │ (auth,CORS) │  │ (mount)     │  │ (input)     │  │ (central)       │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────────▲────────┘  │
│         │                │                │                   │          │
│         └────────────────┼────────────────┘                   │          │
│                          ▼                                    │          │
│  ┌─────────────────────────────────────────────────────────┐ │          │
│  │                  CONTROLLERS                              │ │          │
│  │  AuthController | CustomerController | VehicleController  │ │          │
│  │  BookingController                                        │ │          │
│  └──────────────────────────┬──────────────────────────────┘ │          │
│                             │ chama                          │          │
│                             ▼                                │          │
│  ┌─────────────────────────────────────────────────────────┐ │          │
│  │                   SERVICES                               │ │          │
│  │  AuthService | CustomerService | VehicleService          │ │          │
│  │  BookingService (regras: disponibilidade, aprovação,     │ │          │
│  │  cancelamento, cálculo de valor)                         │ │          │
│  └──────────────────────────┬──────────────────────────────┘ │          │
│                             │ chama                          │          │
│                             ▼                                │          │
│  ┌─────────────────────────────────────────────────────────┐ │          │
│  │                 REPOSITORIES                             │ │          │
│  │  UserRepository | CustomerRepository | VehicleRepository  │ │          │
│  │  BookingRepository (abstração sobre MySQL ou Mock)        │ │          │
│  └──────────────────────────┬──────────────────────────────┘ │          │
└─────────────────────────────┼───────────────────────────────┘          │
                              │                                           │
                              ▼                                           │
┌─────────────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                            │
│  MySQL (produção)  ou  Mock em memória (MVP)                            │
└─────────────────────────────────────────────────────────────────────────┘
```

Resumo:
- **Routes** montam os controllers e aplicam middlewares (auth, RBAC).
- **Controllers** não acessam repositories; apenas services.
- **Services** não acessam `req`/`res`; recebem DTOs e retornam dados ou lançam erros.
- **Repositories** abstraem o armazenamento; no MVP pode existir implementação mock que não usa MySQL.

---

## 3. Fluxos Principais

### 3.1 Fluxo de Reserva (Cliente cria agendamento)

1. Cliente autenticado (JWT) envia `POST /bookings` com `vehicle_id`, `start_date`, `end_date`, opcionalmente `notes`.
2. **Controller** valida corpo (validação de schema) e chama `BookingService.create(customerId, dto)`.
3. **BookingService:**
   - Valida datas (não retroativo, start <= end).
   - Busca veículo (VehicleRepository); rejeita se inativo ou em manutenção.
   - Verifica conflito de datas (BookingRepository: existem reservas APPROVED/PENDING no intervalo?).
   - Calcula valor total (diária × dias).
   - Persiste reserva com status `PENDING` (BookingRepository.create).
4. **Controller** retorna 201 e o recurso criado.

### 3.2 Fluxo de Aprovação (Staff aprova ou rejeita)

1. Staff autenticado envia `PATCH /bookings/:id/approve` ou `PATCH /bookings/:id/reject` (e opcionalmente corpo com observações).
2. **Controller** verifica papel STAFF e chama `BookingService.approve(id, userId)` ou `BookingService.reject(id, userId)`.
3. **BookingService:**
   - Carrega reserva; se não existir → NotFound.
   - Se status não for PENDING → erro (ex.: "Só é possível aprovar reservas pendentes").
   - Para approve: opcionalmente revalida conflito de datas; atualiza status para APPROVED, `approved_by`, `approved_at`.
   - Para reject: atualiza status para REJECTED, e opcionalmente `approved_by`/`approved_at`.
   - Persiste (BookingRepository.update).
4. **Controller** retorna 200 e o booking atualizado.

### 3.3 Fluxo de Cancelamento (Cliente cancela própria reserva)

1. Cliente autenticado envia `PATCH /bookings/:id/cancel`.
2. **Controller** verifica que o recurso pertence ao cliente (ou delega ao service) e chama `BookingService.cancel(id, customerId)`.
3. **BookingService:**
   - Carrega reserva; se não existir → NotFound.
   - Verifica se `booking.customer_id === customerId`; caso contrário → Forbidden.
   - Verifica se status permite cancelamento (ex.: PENDING ou APPROVED); se já CANCELED/REJECTED → erro.
   - Atualiza status para CANCELED e persiste.
4. **Controller** retorna 200 e o booking atualizado.

---

## 4. ADRs (Architecture Decision Records)

### ADR-001: Uso de Node.js

**Status:** Aceito  
**Contexto:** Necessidade de uma API REST performática, ecosistema rico e alinhamento com JavaScript no frontend (React).

**Decisão:** Usar Node.js (LTS) como runtime do backend.

**Consequências:**
- **Positivo:** Um único idioma (JavaScript/TypeScript) no front e back; grande ecossistema (Express, Jest, etc.); adequado para I/O e APIs REST.
- **Negativo:** Single-thread; CPU-bound pesado exigiria workers ou outro serviço. Para este projeto (CRUD, regras de negócio moderadas), o trade-off é aceitável.

---

### ADR-002: Uso de MySQL

**Status:** Aceito  
**Contexto:** Necessidade de persistência relacional, integridade referencial e suporte a transações para reservas e usuários.

**Decisão:** Usar MySQL como banco de dados em produção.

**Consequências:**
- **Positivo:** Modelo relacional adequado (users, customers, vehicles, bookings com FKs); ACID; ferramentas e hospedagem comuns.
- **Negativo:** Escala horizontal mais complexa que em bancos NoSQL; para o escopo do portal, escala vertical é suficiente. Migrations e schema devem ser versionados.

---

### ADR-003: Uso de JWT

**Status:** Aceito  
**Contexto:** API stateless precisa identificar usuário e papel (CLIENT/STAFF) em cada requisição.

**Decisão:** Autenticação baseada em JWT (access token no header `Authorization: Bearer <token>`).

**Consequências:**
- **Positivo:** Stateless; fácil de consumir no frontend; payload pode carregar `userId` e `role` para RBAC.
- **Negativo:** Revogação antes do expiry exige blacklist ou tokens de vida curta + refresh; para o MVP, expiry limitado é aceitável. Segredos e algoritmo devem ser configurados com segurança.

---

### ADR-004: Mock de dados no MVP

**Status:** Aceito  
**Contexto:** Reduzir dependência de infraestrutura (MySQL) nas fases iniciais e em testes.

**Decisão:** Permitir uma implementação de repositórios em memória (mock) para o MVP, com interface idêntica aos repositórios que usam MySQL.

**Consequências:**
- **Positivo:** Desenvolvimento e testes sem banco; deploy simplificado no início; troca para MySQL apenas trocando implementação dos repositories.
- **Negativo:** Dados não persistem entre reinícios; não reflete comportamento real de concorrência e transações. Deve haver plano de migração para MySQL em produção e testes de integração contra banco real ou container.

---

### ADR-005: Separação de regras de negócio na camada Service

**Status:** Aceito  
**Contexto:** Manter controllers simples e testabilidade das regras de negócio.

**Decisão:** Concentrar todas as regras de negócio na camada **Service**. Controllers apenas delegam e formatam; repositories apenas leem/escrevem.

**Consequências:**
- **Positivo:** Regras testáveis sem HTTP; controllers finos; troca de persistência (mock/MySQL) sem alterar regras; clareza de onde implementar novas regras.
- **Negativo:** Mais arquivos e camadas; deve-se evitar que o service fique acoplado a detalhes de transporte (req/res). O trade-off é favorável para manutenção e evolução.
