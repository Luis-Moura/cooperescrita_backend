## 1. Buscar Usuário por Email

- **Método:** GET
- **Rota:** `/admin/find-by-email`
- **Descrição:** Busca um usuário pelo email fornecido. Apenas administradores podem acessar esta rota.
- **Autenticação:** Necessita de um token JWT no header `Authorization` com papel de admin.
- **Parâmetros:**
  - **Body:**
    - `email`: string - Email do usuário a ser buscado.
- **Resposta:**
  - **200 OK:** `{ id: ..., email: ..., name: ... }` (sem a senha)
  - **409 Conflict:** `{ message: 'User not found' }`

---

## 2. Buscar Usuário por Nome

- **Método:** GET
- **Rota:** `/admin/find-by-name`
- **Descrição:** Busca um usuário pelo nome fornecido. Apenas administradores podem acessar esta rota.
- **Autenticação:** Necessita de um token JWT no header `Authorization` com papel de admin.
- **Parâmetros:**
  - **Body:**
    - `name`: string - Nome do usuário a ser buscado.
- **Resposta:**
  - **200 OK:** `{ id: ..., email: ..., name: ... }` (sem a senha)
  - **409 Conflict:** `{ message: 'User not found' }`

---

## 3. Deletar Usuário por Email

- **Método:** DELETE
- **Rota:** `/admin/delete-user-by-email`
- **Descrição:** Deleta um usuário pelo email fornecido. Apenas administradores podem acessar esta rota.
- **Autenticação:** Necessita de um token JWT no header `Authorization` com papel de admin.
- **Parâmetros:**
  - **Body:**
    - `email`: string - Email do usuário a ser deletado.
- **Resposta:**
  - **200 OK:** `{ message: 'User deleted successfully' }`
  - **409 Conflict:** `{ message: 'User not found' }` ou `{ message: 'Cannot delete main admin, a security alert has been sent to the main admin' }`

---

## 4. Alterar Senha

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
