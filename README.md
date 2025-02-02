# Installation

> ⚠️ This project uses node v20.11.0

## Install node

Run `nvm install 20.11.0` to install node v20.11.0 and then `nvm use 20.11.0` to use it.

## Package manager

This project uses `pnpm` as its package manager. You can install it with `npm i -g pnpm`.

To install the dependencies, run

```
pnpm i
```

# Project structure

This project is a monorepo composed of two `apps`:

- `apps/orders`: The orders api
- `apps/invoices`: The invoices api

# Usage

To run the project you will need to have docker installed in your computer. To start the project, run:

```
docker compose up -d
```

In case you want to run the project in watch mode, run:

```
docker compose watch
```

This will expose the following ports:

- Orders API: http://localhost:3000
- Invoices API: http://localhost:4200
- DynamoDB: http://localhost:8000
- RabbitMQ: http://localhost:15672
  - Username: **guest**
  - Password: **guest**
- DynamoDB Admin: http://localhost:8002

## API Documentation

This project uses openapi together with swagger-ui to generate the documentation. You can access the documentation at:

- Orders API: http://localhost:3000/api/v1/docs/openapi
- Invoices API: http://localhost:4200/api/v1/docs/openapi

# Tech Stack

- [Pnpm](https://pnpm.io/)
- [Typescript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [DynamoDB](https://aws.amazon.com/dynamodb/)
- [Turborepo](https://turborepo.org/)
- [Docker](https://www.docker.com/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [Hono](https://honojs.dev/)
- [Zod](https://github.com/colinhacks/zod)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
