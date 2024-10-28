# Documentação da API de Autenticação

## 1. Registrar Usuário (Sign Up)

- **Método:** POST
- **Rota:** `/signup`
- **Descrição:** Registra um novo usuário.
- **Parâmetros:**
  - **Body:**
    - `name`: string - Nome do usuário.
    - `email`: string - Email do usuário.
    - `password`: string - Senha do usuário.
- **Resposta:**
  - **200 OK:** `{ message: 'User registered successfully. Please check your email for verification instructions.' }`
  - **409 Conflict:** `{ message: 'User already exists' }`
  - **403 Forbidden:** `{ message: 'Only admins can create admin accounts' }`

---

## 2. Criar Usuário Admin (Sign Up Admin)

- **Método:** POST
- **Rota:** `/signup-admin`
- **Descrição:** Registra um novo usuário admin. Apenas usuários com papel de admin podem criar outros admins.
- **Parâmetros:**
  - **Body:**
    - `name`: string - Nome do usuário.
    - `email`: string - Email do usuário.
    - `password`: string - Senha do usuário.
    - `role`: string - Colocar o role como "admin"
- **Autenticação:** Necessita de um token JWT no header `Authorization` com papel de admin.
- **Resposta:**
  - **200 OK:** `{ message: 'User registered successfully. Please check your email for verification instructions.' }`
  - **409 Conflict:** `{ message: 'User already exists' }`
  - **403 Forbidden:** `{ message: 'Only admins can create admin accounts' }`

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
  - **400 Bad Request:** `{ message: 'Invalid or expired token' }`
  - **404 Not Found:** `{ message: 'User not found' }`
  - **409 Conflict:** `{ message: 'User already verified' }`

---

## 4. Login (Sign In)

- **Método:** POST
- **Rota:** `/signin`
- **Descrição:** Faz login do usuário e retorna um token de acesso. Se o usuário tiver autenticação de duas etapas, retorna uma mensagem indicando que um código de verificação foi enviado para o email.
- **Parâmetros:**
  - **Body:**
    - `email`: string - Email do usuário.
    - `password`: string - Senha do usuário.
- **Resposta:**
  - **200 OK:** `{ access_token: '...' }`
  - **200 OK:** `{ message: 'Verification code sent to your email' }` (caso o usuário tenha autenticação de duas etapas)
  - **401 Unauthorized:** `{ message: 'Invalid credentials' }`

---

## 5. Verificar Código (Verify Code)

- **Método:** POST
- **Rota:** `/verify-code`
- **Descrição:** Verifica o código de autenticação de dois fatores.
- **Parâmetros:**
  - **Body:**
    - `email`: string - Email do usuário.
    - `verificationCode`: string - Código de verificação.
- **Resposta:**
  - **200 OK:** `{ access_token: '...' }`
  - **400 Bad Request:** `{ message: 'Invalid verification code' }` ou `{ message: 'Verification code expired' }`
  - **404 Not Found:** `{ message: 'Invalid credentials' }`

---

## 6. Logout (Sign Out)

- **Método:** POST
- **Rota:** `/signout`
- **Descrição:** Faz logout do usuário, invalidando o token.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Resposta:**
  - **200 OK:** `{ message: 'Logout successful' }`
  - **400 Bad Request:** `{ message: 'Invalid token' }`

---

## 7. Esqueci a Senha (Forgot Password)

- **Método:** POST
- **Rota:** `/forgot-password`
- **Descrição:** Envia um email para redefinir a senha.
- **Parâmetros:**
  - **Body:**
    - `email`: string - Email do usuário.
- **Resposta:**
  - **200 OK:** `{ message: 'Email sent with instructions to reset your password' }`
  - **404 Not Found:** `{ message: 'User not found' }`

---

## 8. Formulário de Redefinição de Senha (Reset Password Form)

- **Método:** GET
- **Rota:** `/reset-password`
- **Descrição:** Retorna o formulário para redefinir a senha usando um token.
- **Parâmetros:**
  - **Query:**
    - `token`: string - Token de redefinição.
- **Resposta:**
  - **200 OK:** Renderiza a página de redefinição de senha ou redireciona se o token for inválido.
  - **400 Bad Request:** `{ message: 'Invalid token' }`

---

## 9. Redefinir Senha (Post Reset Password)

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
  - **400 Bad Request:** `{ message: 'Invalid or expired token' }` ou `{ message: 'Invalid token or password' }`
  - **409 Conflict:** `{ message: 'Password cannot be the same' }`

---

## 10. Senha Criada (Password Created)

- **Método:** GET
- **Rota:** `/password-created`
- **Descrição:** Renderiza a página de confirmação de senha criada.
- **Resposta:**
  - **200 OK:** Renderiza a página de confirmação de senha criada.

---

## 11. Ver Detalhes do Usuário (Get Me)

- **Método:** GET
- **Rota:** `/me`
- **Descrição:** Retorna os detalhes do usuário autenticado.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Resposta:**
  - **200 OK:** `{ id: ..., email: ..., name: ... }`

## 12. Verificar Token (Verify Token)

- **Método:** GET
- **Rota:** `/verify-token`
- **Descrição:** Verifica a validade de um token JWT.
- **Autenticação:** Necessita de um token JWT no header `Authorization`.
- **Resposta:**
  - **200 OK:** `{ message: 'Token is valid' }`
  - **400 Bad Request:** `{ message: 'Invalid token' }`
