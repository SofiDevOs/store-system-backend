# estapa de compilado
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json .

RUN pnpm install

COPY . .

RUN pnpm run db:generate

RUN pnpm build

# estapa de producción
FROM node:22-alpine AS production

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production

ENV PORT=3000

EXPOSE 3000

COPY package.json .

RUN pnpm install

COPY . .

COPY --from=build /app/dist ./dist

RUN mkdir -p /app/data

CMD [ "pnpm", "run", "start" ]