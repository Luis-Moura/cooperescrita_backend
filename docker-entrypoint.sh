#!/bin/sh
set -e

# Esperar pelo banco de dados
echo "Waiting for database connection..."
sh -c 'until nc -z ${DATABASE_HOST:-postgres} ${DATABASE_PORT:-5432}; do echo "Waiting for database"; sleep 2; done;'

# Executar migrações
echo "Running database migrations..."
npm run migration:run

# Executar o comando passado como argumento
echo "Starting application..."
exec "$@"