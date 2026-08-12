# PR Forge

Workout tracker for creating routines, logging sessions and following strength progression

Built with Next.js, Express, Sequelize and PostgreSQL.

## Tech stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL, Sequelize
- Testing: Vitest, Supertest
- Tooling: Docker Compose, ESLint, Prettier, GitHub Actions CI

## Run with Docker

Docker Desktop and Docker Compose are required, open Docker Desktop before running the commands

From the project root, create the environment file:

```
Copy-Item .env.example .env
```

On macOS or Linux:

```
cp .env.example .env
```

Then start the application:

```
docker compose up --build
```

The first start builds the images, runs the migrations and loads the exercise catalog

- App: `http://localhost:3000`
- API health: `http://localhost:3001/health`

Use `Ctrl+C` to stop the logs, then remove the containers with:

```
docker compose down
```

Database data is kept between restarts

## Run without Docker

This requires Node.js 24 and a local PostgreSQL instance.

Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env.local`. Update the database values in `backend/.env` and create the configured database before running:

```
npm ci
npm run db:setup
npm run dev
```

## Checks

```
npm run format:check
npm run lint
npm test
npm run build
```

Integration tests use the database configured in `backend/.env.test`. The database name must end in `_test`

## Structure

- `frontend`: Next.js application
- `backend`: Express API, database models, migrations and tests
- `.github/workflows`: CI workflow
- `docker-compose.yml`: local Docker setup
