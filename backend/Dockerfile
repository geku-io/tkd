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

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/yarn.lock ./
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

USER nodejs

EXPOSE 3001

CMD ["node", "dist/main.js"]