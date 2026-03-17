FROM node:24-slim AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# FROM nginx:1.28.2-alpine-slim
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

# COPY --from=builder /app/.next /usr/share/nginx/html

# COPY --from=builder nginx.conf /etc/nginx/nginx.conf

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
