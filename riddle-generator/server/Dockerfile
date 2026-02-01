# Multi-stage build for NestJS application

# Stage 1: Base image with dependencies
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Stage 2: Dependencies installation
FROM base AS deps
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Stage 3: Development stage
FROM base AS development
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "start:dev"]

# Stage 4: Build stage
FROM base AS build
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build
RUN pnpm prune --prod

# Stage 5: Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nestjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "dist/main.js"]