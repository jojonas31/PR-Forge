# PR Forge

A full-stack workout tracker for building routines, logging training sessions and monitoring strength progression.

PR Forge Demo video: https://youtu.be/zm56ngPskZ0

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

## Stack

Next.js · React · Tailwind CSS · Express · PostgreSQL · Sequelize · Vitest · Docker

## Run locally

Docker Desktop and Docker Compose are required.

On Windows PowerShell:

```
Copy-Item .env.example .env
docker compose up --build
```

On macOS or Linux:

```
cp .env.example .env
docker compose up --build
```

The first start runs the database migrations and loads the exercise catalog.

- App: `http://localhost:3000`
- API health: `http://localhost:3001/health`

## Quality checks

```
npm ci
npm run format:check
npm run lint
npm test
npm run build
```

Integration tests require a separate PostgreSQL database whose name ends in `_test`.
