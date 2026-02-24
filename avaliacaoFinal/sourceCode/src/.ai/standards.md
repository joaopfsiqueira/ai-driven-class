# Padrões e Convenções do Projeto

Este documento define convenções obrigatórias para o desenvolvimento do Portal de Aluguel de Carros. Use linguagem prescritiva: **Deve** e **Não deve**.

---

## 1. Convenções de Código

### Geral
- **Deve** usar TypeScript estrito (`strict: true`) em todo o código.
- **Deve** usar aspas duplas para strings, exceto quando a string contiver aspas duplas.
- **Deve** usar ponto e vírgula ao final de instruções.
- **Não deve** usar `any`; preferir tipos explícitos ou `unknown` com type guards.
- **Deve** limitar linhas a 100 caracteres; quebrar em múltiplas linhas quando exceder.
- **Deve** usar trailing comma em objetos e arrays multilinha.

### Backend (Node.js/Express)
- **Deve** exportar uma única responsabilidade por módulo (função, classe ou objeto).
- **Deve** injetar dependências (repositories, services) em vez de instanciar dentro de módulos.
- **Não deve** colocar lógica de negócio em controllers; controllers apenas delegam ao service e formatam resposta.

### Frontend (React)
- **Deve** usar componentes funcionais com hooks.
- **Deve** manter componentes pequenos e reutilizáveis; extrair lógica para hooks ou services quando necessário.
- **Não deve** realizar chamadas HTTP diretamente em componentes; usar camada de serviço/API (ex.: Axios em módulo dedicado).

---

## 2. Padrões de Nomenclatura

### Arquivos e pastas
- **Deve** usar **kebab-case** para nomes de arquivos e pastas: `booking-service.ts`, `auth-middleware.ts`.
- **Deve** usar sufixos descritivos: `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.middleware.ts`, `*.validation.ts`.

### Código
- **Classes e interfaces:** PascalCase — `BookingService`, `VehicleRepository`, `BookingStatus`.
- **Funções e variáveis:** camelCase — `createBooking`, `findById`, `startDate`.
- **Constantes e enums:** UPPER_SNAKE_CASE para valores imutáveis — `MAX_BOOKING_DAYS`, `DEFAULT_PAGE_SIZE`.
- **Tipos/Interfaces:** prefixar interfaces com `I` apenas se a equipe adotar; caso contrário, usar PascalCase sem prefixo (ex.: `Booking`, `User`).
- **Rotas e recursos REST:** substantivos no plural, kebab-case se composto — `/bookings`, `/vehicles/:id/availability`.

### Banco de dados
- **Tabelas:** snake_case, plural — `users`, `customers`, `vehicles`, `bookings`.
- **Colunas:** snake_case — `start_date`, `daily_rate`, `approved_by`.
- **Chaves estrangeiras:** `{tabela_singular}_id` — `customer_id`, `vehicle_id`, `user_id`.

---

## 3. Estrutura de Pastas Obrigatória

### Backend (`/` ou `/backend/` na raiz do projeto)
```
src/
├── controllers/     # Um controller por recurso (auth, customers, vehicles, bookings)
├── routes/          # Definição de rotas e montagem em app
├── services/        # Regras de negócio; um service por domínio
├── repositories/    # Acesso a dados; um repository por entidade
├── middlewares/     # Auth, erro, validação, logging
├── validations/     # Schemas e validação de entrada (ex.: Joi/Zod)
├── config/          # Configuração (DB, env, JWT)
├── types/           # Tipos e interfaces compartilhados
└── server.ts        # Entrada da aplicação
```

- **Deve** manter controllers finos; **não deve** acessar repositórios diretamente no controller.
- **Deve** concentrar regras de negócio em services; repositories apenas leem/escrevem dados.
- **Deve** ter um arquivo de rotas por recurso (ex.: `auth.routes.ts`, `bookings.routes.ts`) e montá-los em um `index` ou `app`.

### Frontend
```
src/
├── components/      # Componentes reutilizáveis
├── pages/           # Páginas/views por rota
├── services/        # Chamadas à API (Axios)
├── hooks/           # Hooks customizados
├── context/         # Context API se necessário
├── types/           # Tipos TypeScript
└── App.tsx
```

- **Deve** colocar chamadas HTTP em `services/` (ex.: `bookingService.ts`, `authService.ts`).

---

## 4. Padrões REST

- **Deve** usar verbos HTTP corretos: GET (leitura), POST (criação), PUT (substituição completa), PATCH (atualização parcial), DELETE (remoção).
- **Deve** usar códigos HTTP semânticos: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 422 (Unprocessable Entity), 500 (Internal Server Error).
- **Deve** usar substantivos no plural para recursos: `/bookings`, `/vehicles`, `/customers`.
- **Deve** usar sub-recursos quando fizer sentido: `/vehicles/:id/availability`, `/bookings/:id/cancel`.
- **Não deve** usar verbos na URL; a ação é dada pelo método HTTP (ex.: não usar `/bookings/create`, usar `POST /bookings`).
- **Deve** aceitar e retornar JSON com `Content-Type: application/json`.
- **Deve** usar query params para filtros e paginação: `?page=1&limit=10`, `?start=YYYY-MM-DD&end=YYYY-MM-DD`.

---

## 5. Boas Práticas de Segurança

- **Deve** armazenar senhas com hash (ex.: bcrypt); **não deve** armazenar senhas em texto plano.
- **Deve** usar JWT com tempo de expiração limitado; **não deve** colocar dados sensíveis no payload.
- **Deve** validar e sanitizar toda entrada do usuário (body, query, params) antes de usar.
- **Deve** aplicar middleware de autenticação em rotas protegidas e de autorização por papel (RBAC).
- **Não deve** expor stack traces ou detalhes internos em respostas de erro em produção.
- **Deve** usar variáveis de ambiente para segredos (DB, JWT_SECRET); **não deve** commitar segredos.
- **Deve** usar HTTPS em produção.

---

## 6. Convenções de Commits

- **Deve** usar mensagens no formato convencional: `tipo(escopo): descrição curta`.
- Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- Exemplos: `feat(bookings): add cancel endpoint`, `fix(auth): validate token expiry`, `docs(api): update openapi`.
- **Deve** usar imperativo na descrição: "add" e não "added" ou "adds".
- **Pode** adicionar corpo e rodapé para commits maiores; a primeira linha **deve** ser curta (até ~72 caracteres).

---

## 7. Estrutura de Testes

- **Deve** usar Jest como runner de testes.
- **Deve** colocar testes ao lado do código ou em pasta `__tests__`/`*.test.ts` ou `*.spec.ts`.
- **Deve** nomear arquivos de teste: `{nome-do-modulo}.test.ts` ou `{nome-do-modulo}.spec.ts`.
- **Deve** estruturar testes com describe/it (ou test); **deve** usar descrições claras (comportamento esperado).
- **Deve** mockar repositórios e serviços externos em testes unitários; **pode** usar banco em memória ou container para testes de integração.
- **Deve** cobrir services com testes unitários (regras de negócio); **deve** cobrir endpoints críticos com testes de integração.
- **Não deve** depender de ordem de execução dos testes; cada teste **deve** ser independente.

---

## 8. Tratamento de Erros

- **Deve** usar um middleware central de erro (error handler) que capture exceções e formate resposta conforme padrão da API.
- **Deve** lançar erros tipados ou com código quando aplicável (ex.: `ConflictError`, `ValidationError`, `NotFoundError`) para que o middleware mapeie para HTTP e corpo corretos.
- **Não deve** retornar stack trace ao cliente em produção.
- **Deve** logar erros no servidor (com nível e contexto) antes de responder ao cliente.
- Em validação de entrada: **deve** retornar 400/422 com lista de erros por campo quando aplicável.

---

## 9. Padrão de Responses da API

### Sucesso
- **Deve** retornar JSON com estrutura consistente.
- Criação (201): **deve** incluir o recurso criado e, se aplicável, `id` e `Location` header.
- Leitura (200): **deve** retornar objeto ou array no campo `data` (ex.: `{ "data": { ... } }` ou `{ "data": [ ... ] }`).
- Atualização (200): **deve** retornar o recurso atualizado em `data`.
- Deleção (204): **deve** retornar corpo vazio.

Exemplo único recurso:
```json
{
  "data": {
    "id": 1,
    "status": "PENDING",
    "start_date": "2025-03-01",
    "end_date": "2025-03-05"
  }
}
```

Exemplo lista (com paginação quando aplicável):
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}
```

### Erro
- **Deve** retornar objeto de erro padronizado:

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Mensagem legível para o cliente.",
    "details": []
  }
}
```

- `details` **pode** conter erros de validação por campo, por exemplo:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos.",
    "details": [
      { "field": "start_date", "message": "start_date deve ser uma data futura." }
    ]
  }
}
```

- **Deve** usar códigos HTTP coerentes com o código em `error.code` (ex.: VALIDATION_ERROR → 422, CONFLICT → 409, UNAUTHORIZED → 401, FORBIDDEN → 403, NOT_FOUND → 404).
