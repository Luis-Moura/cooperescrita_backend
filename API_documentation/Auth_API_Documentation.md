## 1. Criar Usuário (Signup)

- **Método:** POST
- **Rota:** `/signup`
- **Descrição:** Registra um novo usuário.
- **Parâmetros:**
  - **Body:**
    - `email`: string - Email do usuário.
    - `name`: string - Nome do usuário.
    - `password`: string - Senha do usuário.
- **Resposta:**
  - **200 OK:** `{ message: 'User registered successfully. Please check your email for verification instructions.' }`
  - **409 Conflict:** `{ message: 'User already exists' }` ou `{ message: 'Invalid data' }`

---

## 2. Criar Usuário Admin (Signup Admin)

- **Método:** POST
- **Rota:** `/signup-admin`
- **Descrição:** Registra um novo usuário admin. Apenas usuários com papel de admin podem criar outros admins.
- **Parâmetros:**
  - **Body:**
    - `email`: string - Email do usuário.
    - `name`: string - Nome do usuário.
    - `password`: string - Senha do usuário.
- **Autenticação:** Necessita de um token JWT no header `Authorization` com papel de admin.
- **Resposta:**
  - **200 OK:** `{ message: 'User registered successfully. Please check your email for verification instructions.' }`
  - **409 Conflict:** `{ message: 'User already exists' }` ou `{ message: 'Only admins can create admin accounts' }`

---

## 3. Verificar Conta (Verify Account)

- **Método:** GET
- **Rota:** `/verify-account`
- **Descrição:** Verifica o email do usuário usando um token.
- **Parâmetros:**
  - **Query:**
    - `token`: string - Token de verificação.
- **Resposta:**
  - **200 OK:** `{ message: 'Email verified successfully' }`
  - **409 Conflict:** `{ message: 'Invalid token' }` ou `{ message: 'User not found' }`

---

## 4. Login (Sign In)

- **Método:** POST
- **Rota:** `/signin`
- **Descrição:** Faz login do usuário e retorna um token de acesso.
- **Parâmetros:**
  - **Body:**
    - `email`: string - Email do usuário.
    - `password`: string - Senha do usuário.
- **Resposta:**
  - **200 OK:** `{ access_token: '...' }`
  - **409 Conflict:** `{ message: 'User not verified' }` ou `{ message: 'Invalid credentials' }`

---

## 5. Logout (Sign Out)

- **Método:** POST
- **Rota:** `/signout`
- **Descrição:** Faz logout do usuário, invalidando o token.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Resposta:**
  - **200 OK:** `{ message: 'Logout successful' }`

---

## 6. Esqueci a Senha (Forgot Password)

- **Método:** POST
- **Rota:** `/forgot-password`
- **Descrição:** Envia um email para redefinir a senha.
- **Parâmetros:**
  - **Body:**
    - `email`: string - Email do usuário.
- **Resposta:**
  - **200 OK:** `{ message: 'Email sent with instructions to reset your password' }`
  - **409 Conflict:** `{ message: 'User not found' }`

---

## 7. Formulário de Redefinição de Senha (Reset Password Form)

- **Método:** GET
- **Rota:** `/reset-password`
- **Descrição:** Retorna o formulário para redefinir a senha usando um token.
- **Parâmetros:**
  - **Query:**
    - `token`: string - Token de redefinição.
- **Resposta:**
  - **200 OK:** Renderiza a página de redefinição de senha ou redireciona se o token for inválido.

---

## 8. Redefinir Senha (Post Reset Password)

- **Método:** POST
- **Rota:** `/reset-password`
- **Descrição:** Redefine a senha do usuário.
- **Parâmetros:**
  - **Query:**
    - `token`: string - Token de redefinição.
  - **Body:**
    - `newPassword`: string - Nova senha do usuário.
- **Resposta:**
  - **200 OK:** `{ message: 'Password reset successfully' }`
  - **409 Conflict:** `{ message: 'Invalid or expired token' }` ou `{ message: 'Password cannot be the same' }`

---

## 9. Senha Criada (Password Created)

- **Método:** GET
- **Rota:** `/password-created`
- **Descrição:** Renderiza a página de confirmação de senha criada.
- **Resposta:**
  - **200 OK:** Renderiza a página de confirmação de senha criada.

---

## 10. Ver Detalhes do Usuário (Get Me)

- **Método:** GET
- **Rota:** `/me`
- **Descrição:** Retorna os detalhes do usuário autenticado.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Resposta:**
  - **200 OK:** `{ id: ..., email: ..., name: ... }`
