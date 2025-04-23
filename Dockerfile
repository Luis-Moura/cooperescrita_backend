# Estágio de construção
FROM node:23-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copiar o resto do código fonte
COPY . .

# Compilar o código
RUN npm run build

# Estágio de produção
FROM node:23-alpine AS production

WORKDIR /app

# Copiar dependências e código compilado
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/data-source.ts ./data-source.ts
COPY --from=build /app/src/migrations ./src/migrations

# Script de inicialização
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expor a porta configurada
EXPOSE ${PORT:-3000}

# Comando para iniciar a aplicação
ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]
CMD ["npm", "run", "start:prod"]

# Estágio de desenvolvimento
FROM node:23-alpine AS development

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copiar script de inicialização
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expor a porta configurada
EXPOSE ${PORT:-3000}

# Comando para iniciar em desenvolvimento
ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]