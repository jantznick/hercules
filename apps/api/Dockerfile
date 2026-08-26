# Build context = repo root (prisma/ lives at root; npm workspaces).
# Railway: Dockerfile path = apps/api/Dockerfile, watch/context = repository root.
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY prisma ./prisma/

# Install before NODE_ENV=production so prisma (root devDependency) is available
# for generate + migrate-on-boot (`npm run start:api` → safe-migrate.js).
RUN npm install

COPY apps/api ./apps/api/
COPY scripts ./scripts/

RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build -w @hercules/api

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["npm", "run", "start:api"]
