# Documentação da API de Redações

## 1. Criar Redação

**Método:** POST  
**Rota:** /redacao/create-redacao  
**Descrição:** Cria uma nova redação com status de "enviado" para o usuário autenticado.  
**Autenticação:** Necessita de um token JWT no header Authorization.  
**Parâmetros:**

- **Body:**
  - `title` (string, opcional): Título da redação.
  - `topic` (string, obrigatório): Tema da redação.
  - `content` (string, obrigatório): Conteúdo da redação.

**Resposta:**

- **200 OK:**
  ```json
  {
    "id": "uuid",
    "title": "Redação 1",
    "topic": "Tema",
    "content": "Conteúdo da redação",
    "status": "enviado",
    "createdAt": "2024-11-18T12:34:56Z"
  }
  ```
- **400 Bad Request:**
  ```json
  { "message": "Dados inválidos" }
  ```
- **401 Unauthorized:**
  ```json
  { "message": "Usuário não autenticado" }
  ```

## 2. Buscar Redações do Usuário

**Método:** GET  
**Rota:** /redacao/get-redacoes  
**Descrição:** Retorna todas as redações associadas ao usuário autenticado.  
**Autenticação:** Necessita de um token JWT no header Authorization.

**Resposta:**

- **200 OK:**
  ```json
  [
    {
      "id": "uuid",
      "title": "Redação 1",
      "topic": "Tema",
      "content": "Conteúdo da redação",
      "status": "enviado",
      "createdAt": "2024-11-18T12:34:56Z"
    },
    {
      "id": "uuid",
      "title": "Redação 2",
      "topic": "Outro Tema",
      "content": "Outro conteúdo",
      "status": "rascunho",
      "createdAt": "2024-11-17T11:22:33Z"
    }
  ]
  ```
- **401 Unauthorized:**
  ```json
  { "message": "Usuário não autenticado" }
  ```
- **404 Not Found:**
  ```json
  { "message": "Redações não encontradas" }
  ```

## 3. Buscar Redação por ID

**Método:** GET  
**Rota:** /redacao/get-redacao-id/:id  
**Descrição:** Retorna uma redação específica pelo ID, desde que pertença ao usuário autenticado.  
**Autenticação:** Necessita de um token JWT no header Authorization.  
**Parâmetros:**

- **URL Params:**
  - `id` (string): ID da redação.

**Resposta:**

- **200 OK:**
  ```json
  {
    "id": "uuid",
    "title": "Redação 1",
    "topic": "Tema",
    "content": "Conteúdo da redação",
    "status": "enviado",
    "createdAt": "2024-11-18T12:34:56Z"
  }
  ```
- **400 Bad Request:**
  ```json
  { "message": "ID inválido" }
  ```
- **401 Unauthorized:**
  ```json
  { "message": "Usuário não autenticado" }
  ```
- **404 Not Found:**
  ```json
  { "message": "Redação não encontrada" }
  ```

## 4. Buscar Redações por Status

**Método:** GET  
**Rota:** /redacao/get-redacao-status/:status  
**Descrição:** Retorna todas as redações do usuário autenticado com o status especificado ("rascunho" ou "enviado").  
**Autenticação:** Necessita de um token JWT no header Authorization.  
**Parâmetros:**

- **URL Params:**
  - `status` (string): Status da redação ("rascunho" ou "enviado").

**Resposta:**

- **200 OK:**
  ```json
  [
    {
      "id": "uuid",
      "title": "Redação 1",
      "topic": "Tema",
      "content": "Conteúdo da redação",
      "status": "rascunho",
      "createdAt": "2024-11-17T11:22:33Z"
    }
  ]
  ```
- **400 Bad Request:**
  ```json
  { "message": "Status inválido" }
  ```
- **401 Unauthorized:**
  ```json
  { "message": "Usuário não autenticado" }
  ```
- **404 Not Found:**
  ```json
  { "message": "Redações não encontradas" }
  ```
