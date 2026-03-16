FROM node:24-slim AS build

WORKDIR /app

COPY package.json .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build:prod

FROM nginx:1.28.2-alpine-slim

COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=build nginx.conf /etc/nginx/nginx.conf

ENV NODE_ENV=production

EXPOSE 3000

CMD ["yarn", "start"]