## O que mandamos inicialmente

```text
Um prompt de geração de contexto, que crie esta estrutura: .ai/ ├── standards.md # Convenções de código e estilo ├── architecture.md # Decisões de alto nível (ADRs) ├── tech-stack.md # Versões e libs permitidas └── business-rules.md # Lógica de negócio e domínio Um prompt de implementação, que seja executável por agentes e siga a estrutura criada no passo anterior. Neste momento, vamos implementar um MVP, utilizando os dois prompts na IDE/plugin de preferência do grupo (sugiro o Antigravity), que tenha dados mockados e seja executável localmente. Entregáveis: Prompt de geração de contexto. Prompt de implementação. Link do vídeo de demonstração do projeto rodando, entre 3 e 10 minutos, com comentários sobre o uso do agente e dificuldades encontradas.
```

## Prompt retornado - Contexto

```text
Você é um Software Architect Agent.

Seu objetivo é analisar o projeto atual (Portal de Aluguel de Carros)
e gerar a estrutura de contexto para desenvolvimento orientado por IA.

Crie a seguinte estrutura de diretórios e arquivos na raiz do projeto:

.ai/
├── standards.md
├── architecture.md
├── tech-stack.md
└── business-rules.md

Preencha cada arquivo com conteúdo completo, detalhado e acionável.

---

### 1️⃣ standards.md

Defina:

- Convenções de código
- Padrões de nomenclatura
- Estrutura de pastas obrigatória
- Padrões REST
- Boas práticas de segurança
- Convenções de commits
- Estrutura de testes
- Regras de tratamento de erro
- Padrão de responses da API

Use linguagem prescritiva ("Deve", "Não deve").

---

### 2️⃣ architecture.md

Defina:

- Arquitetura do sistema (MVC + Service + Repository)
- Diagrama textual de camadas
- Fluxos principais (Reserva, Aprovação, Cancelamento)
- ADRs (Architecture Decision Records), incluindo:

  ADR-001: Uso de Node.js
  ADR-002: Uso de MySQL
  ADR-003: Uso de JWT
  ADR-004: Mock de dados no MVP
  ADR-005: Separação de regras de negócio na camada Service

Explique trade-offs.

---

### 3️⃣ tech-stack.md

Defina:

Backend:
- Node.js (versão LTS)
- Express
- TypeScript
- ts-node
- Jest
- UUID

Frontend:
- React
- Vite
- Axios

Banco:
- MySQL (produção)
- Mock repository em memória (MVP)

Defina versões mínimas.

Proíba uso de bibliotecas fora da lista sem justificativa.

---

### 4️⃣ business-rules.md

Descreva todas as regras de negócio do portal:

- Um veículo não pode ser reservado se:
  - estiver inativo
  - estiver em manutenção
  - houver conflito de datas

- Reservas começam como PENDING
- Apenas STAFF pode aprovar
- Apenas CLIENT pode cancelar a própria reserva
- Datas devem ser válidas
- Não permitir reservas retroativas
- Cálculo do valor total = diária × dias

Defina também:

- Status possíveis
- Papéis do sistema
- Casos de borda
- Fluxos alternativos

---

O conteúdo deve ser técnico, completo e suficiente para que outro agente implemente o sistema sem ambiguidade.
```