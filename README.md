# Guia de Trabalho com Git para o Projeto Cooperescrita

## Documentação

1. **Rota da Documentação no swagger**
   ```bash
   localhost:3000/api
   ```

## Configuração do Repositório

1. **Clone o Repositório**:  
   Para começar, clone o repositório do projeto:

   ```bash
   git clone https://github.com/Luis-Moura/cooperescrita_backend.git
   ```

2. **Entre no Diretório do Projeto**:  
   Acesse a pasta do projeto:

   ```bash
   cd cooperescrita_backend
   ```

3. **Verifique se o Repositório Está Configurado**:  
   Certifique-se de que o repositório está conectado ao remoto:
   ```bash
   git remote -v
   ```
   Deve mostrar a URL do repositório `origin`.

## Fluxo de Trabalho Simples

1. **Mude para a Branch `develop`**:  
   Antes de começar a trabalhar, certifique-se de estar na branch `develop`:

   ```bash
   git checkout develop
   ```

2. **Atualize a Branch `develop`**:  
   Sempre traga as últimas mudanças antes de começar a trabalhar:

   ```bash
   git pull origin develop
   ```

3. **Desenvolva e Faça Commits**:  
   Faça suas alterações e adicione-as diretamente na branch `develop`:

   ```bash
   git add .
   git commit -m "Descrição do que você fez"
   ```

4. **Envie Suas Alterações**:  
   Após os commits, envie suas mudanças para o repositório remoto:
   ```bash
   git push origin develop
   ```

## Cuidados Necessários

- **Atualizações Regulares**: Sempre atualize a branch `develop` antes de começar a trabalhar.
- **Mensagens de Commit Claras**: Use mensagens descritivas para facilitar a compreensão das mudanças.
- **Revisão de Código**: Sempre revise as alterações antes de enviar, para evitar bugs.


## Rodando o Projeto com Docker

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Configuração e Execução

1. **Clone o Repositório**:
   ```bash
   git clone https://github.com/Luis-Moura/cooperescrita_backend.git
   cd cooperescrita_backend
   ```

2. **Construa os Containers**:
   ```bash
   docker-compose build --no-cache
   ```

3. **Inicie os Serviços**:
   ```bash
   docker-compose up -d
   ```
   Este comando inicia:
   - Backend (NestJS) na porta 3000
   - PostgreSQL na porta 5432
   - Redis na porta 6379
   - PgAdmin na porta 5050

4. **Verifique se os Containers estão Rodando**:
   ```bash
   docker-compose ps
   ```

5. **Acesse a API**:
   - API: http://localhost:3000
   - Documentação Swagger: http://localhost:3000/api

6. **Acesse o PgAdmin**:
   - URL: http://localhost:5050
   - Email: admin@admin.com
   - Senha: admin

   Para conectar ao PostgreSQL via PgAdmin:
   - Host: postgres
   - Porta: 5432
   - Usuário: postgres
   - Senha: postgres
   - Banco de dados: cooperescrita

### Comandos Úteis

- **Ver logs da aplicação**:
  ```bash
  docker-compose logs -f backend
  ```

- **Entrar no container do backend**:
  ```bash
  docker-compose exec backend sh
  ```

- **Executar migrações manualmente**:
  ```bash
  docker-compose exec backend npm run migration:run
  ```

- **Reiniciar o serviço de backend**:
  ```bash
  docker-compose restart backend
  ```

- **Parar todos os serviços**:
  ```bash
  docker-compose down
  ```

- **Parar e remover volumes (limpar dados)**:
  ```bash
  docker-compose down -v
  ```

### Solução de Problemas

- **Erro de permissão no docker-entrypoint.sh**:
  Se ocorrer erro de permissão ao iniciar os containers, execute:
  ```bash
  chmod +x docker-entrypoint.sh
  docker-compose build --no-cache
  docker-compose up -d
  ```

- **Problemas de conexão com o banco de dados**:
  Verifique se o serviço PostgreSQL está em execução:
  ```bash
  docker-compose ps postgres
  ```
  
  Verifique os logs do PostgreSQL:
  ```bash
  docker-compose logs postgres
  ```