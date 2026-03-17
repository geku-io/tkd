FROM node:24-slim AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Копируем миграции в dist/migrations
COPY src/migrations ./dist/migrations

FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3001

CMD ["node", "dist/main.js"]