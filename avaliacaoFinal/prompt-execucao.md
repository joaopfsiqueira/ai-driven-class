## O que mandamos

```text
Um prompt de geração de contexto, que crie esta estrutura: .ai/ ├── standards.md # Convenções de código e estilo ├── architecture.md # Decisões de alto nível (ADRs) ├── tech-stack.md # Versões e libs permitidas └── business-rules.md # Lógica de negócio e domínio Um prompt de implementação, que seja executável por agentes e siga a estrutura criada no passo anterior. Neste momento, vamos implementar um MVP, utilizando os dois prompts na IDE/plugin de preferência do grupo (sugiro o Antigravity), que tenha dados mockados e seja executável localmente. Entregáveis: Prompt de geração de contexto. Prompt de implementação. Link do vídeo de demonstração do projeto rodando, entre 3 e 10 minutos, com comentários sobre o uso do agente e dificuldades encontradas.
```


## Prompt recebido - Implementação.

```text
Você é um Implementation Agent.

Leia obrigatoriamente todos os arquivos dentro de .ai/
e siga estritamente as definições ali contidas.

Objetivo:
Implementar um MVP executável localmente do Portal de Aluguel de Carros,
utilizando dados mockados em memória (sem banco real).

Requisitos:

1️⃣ Backend:
- Node.js + Express + TypeScript
- Estrutura:

src/
├── controllers/
├── services/
├── repositories/
├── routes/
├── middlewares/
├── models/
├── mocks/
└── server.ts

2️⃣ Dados Mockados

Criar arquivos em:
src/mocks/

- users.mock.ts
- vehicles.mock.ts
- bookings.mock.ts

Os dados devem conter:
- 2 usuários CLIENT
- 1 usuário STAFF
- 5 veículos
- 2 reservas existentes

3️⃣ Funcionalidades do MVP

✔ Login (mock JWT)
✔ Listar veículos
✔ Ver disponibilidade por data
✔ Criar reserva
✔ Aprovar reserva (STAFF)
✔ Cancelar reserva (CLIENT)

4️⃣ Regras obrigatórias

- Validar conflito de datas
- Validar papéis
- Validar status
- Calcular valor total
- Não permitir reserva retroativa

5️⃣ Padrões obrigatórios

- Controller não pode conter regra de negócio
- Regras devem estar na camada Service
- Repository deve simular banco em memória
- Responses devem seguir padrão definido em standards.md

6️⃣ Scripts

Gerar no package.json:

- "dev": ts-node-dev src/server.ts
- "build"
- "start"

7️⃣ README

Atualizar README com:
- Como rodar o projeto
- Rotas disponíveis
- Usuários mock para teste
- Exemplos de curl

8️⃣ Critérios de aceite

- Projeto roda com:
  npm install
  npm run dev

- API responde corretamente
- Não há erro de tipagem TypeScript
- Código segue as convenções do standards.md

Implemente tudo automaticamente.
Não peça confirmação.
Não altere a arquitetura definida.
```