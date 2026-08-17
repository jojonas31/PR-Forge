# PR Forge

A full-stack workout tracker for building routines, logging training sessions and monitoring strength progression

## Live demo

- [Open PR Forge](https://pr-forge-frontend.vercel.app)
- [Watch the video demo](https://youtu.be/zm56ngPskZ0)
- [API health check](https://pr-forge-api.onrender.com/health)

The backend uses a free hosting tier, so the first request after a period of inactivity may take a few moments

## Features

- Account registration and JWT-based authentication
- Custom and beginner-friendly workout routines
- Workout logging with estimated one-rep max calculations
- Personal records, strength points and weekly progress
- Responsive interface for desktop and mobile

## Technical highlights

- Transactional workout completion with Sequelize
- Protected API endpoints with user-scoped resources
- PostgreSQL migrations and repeatable exercise seeding
- Unit and integration tests with Vitest and Supertest
- Reproducible local environment with Docker Compose
- Automated formatting, linting, tests and production builds with GitHub Actions CI

## Tech stack

Next.js, React, Tailwind CSS, Express, PostgreSQL, Sequelize, Vitest and Docker

## Run locally

Requires Docker and Docker Compose

The included database password and JWT secret are local-only defaults

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up --build -d
```

On macOS or Linux:

```sh
cp .env.example .env
docker compose up --build -d
```

The first start runs the database migrations and loads the exercise catalog

- App: `http://localhost:3000`
- API health: `http://localhost:3001/health`

## Quality checks

Requires Node.js 24+ and the Docker services running

Create the test environment and database once

On Windows PowerShell:

```powershell
Copy-Item backend/.env.test.example backend/.env.test
docker compose exec postgres createdb -U root pr_forge_test
```

On macOS or Linux:

```sh
cp backend/.env.test.example backend/.env.test
docker compose exec postgres createdb -U root pr_forge_test
```

The database creation command is only needed once. Skip it if `pr_forge_test` already exists

Then run from the repository root

```sh
npm ci
npm run format:check
npm run lint
npm test
npm run build
```
