# Estágio de construção
FROM node:22-alpine AS build

WORKDIR /app

# Instalar dependências (incluindo dev para build e migrações)
COPY package*.json ./
RUN npm ci

# Copiar o resto do código fonte
COPY . .

# Compilar o código
RUN npm run build

# Estágio de produção
FROM node:22-alpine AS production

WORKDIR /app

# Copiar package.json e instalar apenas dependências de produção + ferramentas para migração
COPY package*.json ./
RUN npm ci --only=production

# Instalar ts-node e tsconfig-paths para executar migrações
RUN npm install ts-node tsconfig-paths

# Copiar arquivos necessários do build
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/data-source.ts ./
COPY --from=build /app/tsconfig.json ./
COPY --from=build /app/tsconfig.build.json ./

# Expor a porta
EXPOSE 3000

# Script de inicialização que roda migrações e depois inicia a app
CMD ["sh", "-c", "npm run migration:run && node dist/src/main.js"]