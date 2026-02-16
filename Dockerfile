# Base stage
FROM node:22-slim AS base
WORKDIR /app
RUN corepack enable
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

# Dependencies stage
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run db:generate
RUN pnpm run build
RUN pnpm prune --prod

# Production stage
FROM base AS production
ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only if not using pruned modules from build
# But since we pruned in build, we can copy from there or re-install.
# Let's copy the pruned node_modules for efficiency.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# Create data directory and set permissions
RUN mkdir -p /app/data && chown -R node:node /app/data

# Switch to non-root user
USER node

EXPOSE 3000

CMD [ "pnpm", "run", "start" ]