# Documentação da API - Users

## 1. Buscar Usuário por Email

- **Método:** GET
- **Rota:** `/users`
- **Descrição:** Busca um usuário pelo email fornecido.
- **Parâmetros:**
  - **Body:**
    - `email`: string - Email do usuário a ser buscado.
- **Resposta:**
  - **200 OK:** `{ id: ..., email: ..., name: ... }` (sem a senha)
  - **409 Conflict:** `{ message: 'User not found' }`

---

## 2. Alterar Senha

- **Método:** POST
- **Rota:** `/users/change-password`
- **Descrição:** Altera a senha do usuário autenticado.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Parâmetros:**
  - **Body:**
    - `oldPassword`: string - Senha antiga do usuário.
    - `newPassword`: string - Nova senha do usuário.
- **Resposta:**
  - **200 OK:** `{ message: 'Password changed successfully' }`
  - **409 Conflict:** `{ message: 'Invalid password' }` ou `{ message: 'User not found' }`
