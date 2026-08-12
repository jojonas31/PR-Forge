# PR Forge

Full-stack workout application for creating routines, logging training sessions and tracking progression.

The repository is an npm monorepo with a Next.js frontend, an Express API and PostgreSQL.

## Run the complete application with Docker

Requirements: Docker Desktop with Docker Compose.

1. Create the root environment file:

```powershell
Copy-Item .env.example .env
```

The included values are intended only for local development.

2. Start the application:

```bash
docker compose up --build
```

3. Open `http://localhost:3000` and register an account.

Docker creates the database, runs the migrations, loads the exercise catalog and starts both applications. The API health endpoint is available at `http://localhost:3001/health`.

Stop the containers with:

```bash
docker compose down
```

## Local development

Requirements: Node.js 24 and PostgreSQL.

Create `backend/.env` and `frontend/.env.local` from their example files, then run from the repository root:

```bash
npm ci
npm run db:setup
npm run dev
```

The frontend runs on `http://localhost:3000` and the API on `http://localhost:3001`.

## Commands

```bash
npm run dev
npm run db:setup
npm run build
npm run lint
npm test
npm run format:check
```

Integration tests use the PostgreSQL database configured in `backend/.env.test`. Its name must end in `_test`.

## Structure

- `frontend`: Next.js and React web application
- `backend`: Express API, Sequelize models, migrations and tests
- `docker-compose.yml`: complete local environment
