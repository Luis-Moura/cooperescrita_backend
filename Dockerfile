FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache procps

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

# Comando para desenvolvimento
CMD ["sh", "-c", "npm run migration:run && npm run start:dev"]