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
  - **404 Not Found:** `{ message: 'User not found' }`
  - **403 Forbidden:** `{ message: 'Cannot access, a security alert has been sent to the main admin' }`

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
  - **404 Not Found:** `{ message: 'User not found' }`
  - **403 Forbidden:** `{ message: 'Cannot access, a security alert has been sent to the main admin' }`

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
  - **404 Not Found:** `{ message: 'User not found' }`
  - **403 Forbidden:** `{ message: 'Cannot delete, a security alert has been sent to the main admin' }`

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
  - **400 Bad Request:** `{ message: 'Invalid password' }`
  - **404 Not Found:** `{ message: 'User not found' }`

---

## 5. Ativar Autenticação de Dois Fatores (Activate Two-Factor Authentication)

- **Método:** POST
- **Rota:** `/users/activate-twoFA`
- **Descrição:** Ativa a autenticação de dois fatores para o usuário autenticado.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Resposta:**
  - **200 OK:** `{ message: 'Two-factor authentication activated' }`
  - **409 Conflict:** `{ message: 'Two-factor authentication already enabled' }`
  - **404 Not Found:** `{ message: 'User not found' }`

---

## 6. Desativar Autenticação de Dois Fatores (Deactivate Two-Factor Authentication)

- **Método:** POST
- **Rota:** `/users/desativate-twoFA`
- **Descrição:** Desativa a autenticação de dois fatores para o usuário autenticado. Não pode ser desativada para administradores.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Resposta:**
  - **200 OK:** `{ message: 'Two-factor authentication disabled' }`
  - **409 Conflict:** `{ message: 'Two-factor authentication already disabled' }`
  - **404 Not Found:** `{ message: 'User not found' }`
  - **403 Forbidden:** `{ message: 'Cannot disable two-factor authentication for admins' }`

---

## 7. Deletar Conta (Delete Account)

- **Método:** DELETE
- **Rota:** `/users/delete-account`
- **Descrição:** Deleta a conta do usuário autenticado.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Resposta:**
  - **200 OK:** `{ message: 'Account deleted successfully' }`
  - **404 Not Found:** `{ message: 'User not found' }`
  - **403 Forbidden:** `{ message: 'Cannot delete main admin, a security alert has been sent to the main admin' }`