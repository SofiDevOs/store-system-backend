FROM node:22-alpine AS build

WORKDIR /app

COPY . .

RUN corepack enable

RUN pnpm install

RUN pnpm build

FROM node:22-alpine AS production

WORKDIR /app

ENV PORT=8080

EXPOSE 8080

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod

COPY --from=build /app/dist ./dist

CMD [ "pnpm", "run", "start" ]