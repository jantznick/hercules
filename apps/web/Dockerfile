# Build context = repo root.
# Railway: Dockerfile path = apps/web/Dockerfile; set build arg / variable VITE_API_URL.
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

RUN npm install

COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY src ./src
COPY public ./public

ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve@14

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# SPA mode (-s): unknown paths → index.html. Bind Railway's PORT.
CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT}"]
