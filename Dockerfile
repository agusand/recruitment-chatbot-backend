# Etapa de build
FROM node:22.16.0-alpine

WORKDIR /app
RUN apk update && apk upgrade --no-cache

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
