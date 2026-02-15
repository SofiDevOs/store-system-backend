# estapa de compilado
FROM node:22 AS build

WORKDIR /app

RUN corepack enable

COPY package.json .

RUN pnpm install

COPY . .

RUN pnpm run db:generate

RUN pnpm build

# estapa de desarrollo
FROM node:22 AS development

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=development

COPY package.json .

RUN pnpm install

COPY . .

EXPOSE 3000


# estapa de producción
FROM node:22 AS production

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