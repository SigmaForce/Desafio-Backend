# Cubos API

Uma API de gerenciamento de filmes construída com Fastify, PostgreSQL e TypeScript.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (Recomendada a versão LTS mais recente)
- [pnpm](https://pnpm.io/) (v10.19.0 ou superior)
- [Docker](https://www.docker.com/) (para o banco de dados PostgreSQL)

## Instalação

1. Clone o repositório

```bash
git https://github.com/SigmaForce/Desafio-Frontend.git
cd Desafio-Frontend
```

2. Instale as dependências:

```bash
pnpm install
```

3. Inicie o banco de dados PostgreSQL usando Docker:

```bash
docker compose up -d
```

4. Execute as migrações do banco de dados:

```bash
pnpm db:generate
pnpm db:migrate
```

5. (Opcional) Popule o banco de dados com dados iniciais:

```bash
pnpm db:seed
```

## Configuração do Ambiente

1. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/movies"
COOKIE_SECRET=43e701b5-3252-43b9-a436-a8e4625c4d22
RESEND_API_KEY= # RESEND API KEY
AWS_ACCESS_KEY_ID= # AWS ACCESS KEY
AWS_SECRET_ACCESS_KEY= # AWS SECRET KEY
AWS_S3_BUCKET_NAME=# NOME DO BUCKET S3
AWS_REGION= # AWS REGION
WEB_URL=http:localhost:3333 #Seu dominio de hospedagem
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
pnpm dev
```

A API estará disponível em `http://localhost:3333`.

## Gerenciamento do Banco de Dados

- Gerar migrações: `pnpm db:generate`
- Aplicar migrações: `pnpm db:migrate`
- Visualizar banco de dados com Drizzle Studio: `pnpm db:studio`
- Popular banco de dados: `pnpm db:seed`

## Funcionalidades

- Autenticação e autorização de usuários
- Gerenciamento de filmes (operações CRUD)
- Gerenciamento de sessões
- Integração com armazenamento AWS S3
- Notificações por e-mail
- Documentação da API com Swagger/OpenAPI

## Stack Tecnológica

- **Runtime**: Node.js
- **Framework**: Fastify
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle ORM
- **Documentação da API**: Swagger/OpenAPI com Scalar
- **Gerenciador de Pacotes**: pnpm
- **Linguagem**: TypeScript
- **Armazenamento de Arquivos**: AWS S3
- **Autenticação**: Implementação personalizada com cookies

## Estrutura do Projeto

```
src/
├── db/                # Configuração e migrações do banco de dados
├── jobs/              # Jobs em background e tarefas agendadas
├── plugins/           # Plugins do Fastify(middleware)
├── routes/            # Rotas e handlers da API
├── services/          # Serviços (EmailService)
└── utils/             # Funções e auxiliares utilitários
```

## Documentação da API

- [Docs](https://desafio-backend-30y2.onrender.com/docs/)

## Cubos Movies (Site)

- [Cubos movies](https://desafio-frontend-three-mauve.vercel.app/)

## Repositorios

- [Backend](https://github.com/SigmaForce/Desafio-Backend)
- [Frontend](https://github.com/SigmaForce/Desafio-Frontend)
