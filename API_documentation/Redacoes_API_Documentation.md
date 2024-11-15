# Documentação da API de Redações

## 1. Criar Redação

- **Método:** POST
- **Rota:** `/redacao/create-redacao`
- **Descrição:** Cria uma nova redação para o usuário autenticado.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Parâmetros:**
  - **Body:**
    - `title`: string - Título da redação(opcional).
    - `topic`: string - Tema da redação.
    - `content`: string - Conteúdo da redação.
- **Resposta:**
  - **200 OK:** `{ message: 'Redação criada com sucesso' }`
  - **400 Bad Request:** `{ message: 'Dados inválidos' }`
  - **401 Unauthorized:** `{ message: 'Usuário não autenticado' }`

---

## 2. Buscar Redações do Usuário

- **Método:** GET
- **Rota:** `/redacao/get-redacoes`
- **Descrição:** Busca todas as redações do usuário autenticado.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Resposta:**
  - **200 OK:** `[ { id: ..., title: ..., content: ..., createdAt: ..., updatedAt: ... }, ... ]`
  - **401 Unauthorized:** `{ message: 'Usuário não autenticado' }`
  - **404 Not Found:** `{ message: 'Usuário não encontrado' }`

---
