FROM node:24-slim AS build

WORKDIR /app

COPY package.json .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

COPY --from=build /app/dist /usr/share/nginx/html

ENV NODE_ENV=production

EXPOSE 3001

CMD ["yarn", "start:prod"]