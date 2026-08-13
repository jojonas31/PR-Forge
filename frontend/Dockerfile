FROM node:24-bookworm-slim AS base

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json


FROM base AS build

RUN npm ci --workspace=pr-forge-frontend && npm cache clean --force

COPY frontend ./frontend

RUN npm run build --workspace=pr-forge-frontend


FROM base AS runtime

ENV NODE_ENV=production

RUN npm ci --omit=dev --workspace=pr-forge-frontend && npm cache clean --force

COPY --from=build --chown=node:node /app/frontend/.next ./frontend/.next

USER node

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=pr-forge-frontend"]
