FROM node:24-bookworm-slim AS base

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json


FROM base AS migrator

RUN npm ci --workspace=pr-forge-backend && npm cache clean --force

COPY backend/.sequelizerc ./backend/.sequelizerc
COPY backend/config ./backend/config
COPY backend/migrations ./backend/migrations
COPY backend/src ./backend/src

USER node

CMD ["npm", "run", "db:setup", "--workspace=pr-forge-backend"]


FROM base AS runtime

RUN npm ci --omit=dev --workspace=pr-forge-backend && npm cache clean --force

COPY backend/src ./backend/src

USER node

EXPOSE 3001

CMD ["npm", "run", "start", "--workspace=pr-forge-backend"]
