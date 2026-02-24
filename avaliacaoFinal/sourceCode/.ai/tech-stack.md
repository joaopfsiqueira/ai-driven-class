# Stack Tecnológica — Portal de Aluguel de Carros

Este documento define as tecnologias permitidas, versões mínimas e a política de inclusão de novas dependências.

---

## 1. Backend

| Tecnologia   | Uso                    | Versão mínima | Observação |
|-------------|------------------------|---------------|------------|
| Node.js     | Runtime                | 20.x LTS      | Usar versão LTS em vigor (20 ou superior LTS). |
| Express     | Framework HTTP         | 4.18          | Rotas, middlewares, servidor. |
| TypeScript  | Linguagem              | 5.0           | Código fonte em TS; compilação para JS. |
| ts-node     | Execução/desenvolvimento| 10.9         | Rodar TS sem build prévio em dev. |
| Jest        | Testes                 | 29.x          | Unit e integração. |
| UUID        | Identificadores       | 9.x           | Geração de UUIDs quando necessário (ex.: tokens, IDs externos). |

- **Deve** usar Node.js em versão LTS (20.x ou superior LTS conforme disponibilidade).
- **Deve** usar TypeScript em todo o código backend; **não deve** usar arquivos `.js` para lógica de aplicação.
- **Deve** usar Express como única framework HTTP do backend.
- **Deve** usar Jest como único runner de testes no backend.
- **Pode** usar bibliotecas de suporte compatíveis (ex.: validação com Zod/Joi, bcrypt para hash de senha, jsonwebtoken para JWT) desde que listadas aqui ou aprovadas (ver seção "Política de dependências").

Dependências de suporte recomendadas (versões mínimas sugeridas):

| Pacote        | Uso              | Versão mínima |
|---------------|------------------|---------------|
| bcrypt        | Hash de senha    | 5.1           |
| jsonwebtoken  | JWT              | 9.0           |
| dotenv        | Variáveis de ambiente | 16.0    |
| zod ou joi    | Validação de entrada | 3.22 / 17.9 |

Driver/ORM para MySQL (uma das opções, com versão mínima):

| Pacote   | Uso              | Versão mínima |
|----------|------------------|---------------|
| mysql2   | Driver MySQL     | 3.6           |
| ou knex  | Query builder    | 2.4           |

---

## 2. Frontend

| Tecnologia | Uso                    | Versão mínima | Observação |
|------------|------------------------|---------------|------------|
| React      | UI                    | 18.x          | Componentes funcionais e hooks. |
| Vite       | Build e dev server    | 5.x           | Bundler e servidor de desenvolvimento. |
| Axios      | Cliente HTTP          | 1.6           | Chamadas à API REST. |
| TypeScript | Linguagem            | 5.0           | Tipagem no frontend. |

- **Deve** usar React 18+ com componentes funcionais.
- **Deve** usar Vite como ferramenta de build e dev server; **não deve** usar Create React App para novos módulos.
- **Deve** usar Axios como cliente HTTP para comunicação com a API; **não deve** usar `fetch` diretamente em código de aplicação (exceto se encapsulado em um módulo de serviço único).
- **Deve** usar TypeScript no frontend.

Dependências de suporte permitidas (exemplos, versões mínimas sugeridas):

| Pacote     | Uso              | Versão mínima |
|------------|------------------|---------------|
| react-router-dom | Roteamento | 6.x           |

---

## 3. Banco de Dados

| Ambiente   | Tecnologia              | Uso |
|------------|--------------------------|-----|
| Produção   | MySQL                    | Persistência definitiva; transações; integridade referencial. |
| MVP / Dev  | Mock em memória          | Implementação de repositórios que não usa MySQL; dados voláteis. |

- **Deve** usar MySQL em ambiente de produção (versão 8.0 ou superior recomendada).
- **Pode** usar implementação de repositórios em memória (mock) no MVP, desde que a interface dos repositórios seja a mesma e o restante do código não dependa do tipo de persistência.
- **Não deve** usar outro SGBD relacional (PostgreSQL, SQLite) ou NoSQL em produção sem uma ADR que justifique a mudança.

---

## 4. Ferramentas e Ambiente

- **Controle de versão:** Git.
- **Gerenciador de pacotes:** npm (versão 9+) ou yarn/pnpm, desde que lockfile seja commitado.
- **Variáveis de ambiente:** Arquivo `.env` (não commitado); uso de `dotenv` ou equivalente no backend.

---

## 5. Política de Dependências

- **Proibido** introduzir bibliotecas fora desta lista sem justificativa documentada (ADR ou atualização deste documento).
- **Deve** justificar novas dependências por: necessidade funcional, segurança, desempenho ou padrão do projeto.
- **Deve** preferir dependências mantidas, com baixo número de vulnerabilidades conhecidas e alinhadas à stack (TypeScript, Node LTS, React 18).
- **Não deve** adicionar dependências que dupliquem responsabilidade já coberta (ex.: outro framework HTTP além do Express, outro cliente HTTP além do Axios no frontend).

---

## 6. Resumo de Versões Mínimas

| Camada   | Tecnologia | Versão mínima |
|----------|------------|---------------|
| Backend  | Node.js    | 20.x LTS      |
| Backend  | Express    | 4.18          |
| Backend  | TypeScript | 5.0           |
| Backend  | ts-node    | 10.9          |
| Backend  | Jest       | 29.x          |
| Backend  | UUID       | 9.x           |
| Frontend | React      | 18.x          |
| Frontend | Vite       | 5.x           |
| Frontend | Axios      | 1.6           |
| DB       | MySQL      | 8.0 (produção)|

Este documento deve ser atualizado sempre que uma nova tecnologia for incorporada ou uma versão mínima for alterada.
