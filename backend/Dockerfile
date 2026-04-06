FROM node:24-slim AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/yarn.lock ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

USER node

EXPOSE 3001

CMD ["node", "dist/main.js"]