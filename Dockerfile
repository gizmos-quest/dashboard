FROM node:20-alpine AS build
LABEL org.opencontainers.image.source=https://github.com/gizmos-quest/dashboard
WORKDIR /app
RUN npm install -g bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build.client && bun run build.server

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/server ./server
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server/entry.node-server"]
