# 🔐 Documentação do Sistema de Autenticação - Cooperescrita

## 📋 Visão Geral

O sistema de autenticação da Cooperescrita é uma solução robusta e completa que gerencia o ciclo de vida dos usuários desde o registro até o logout, com recursos avançados de segurança como autenticação em duas etapas (2FA), refresh tokens e proteção contra ataques.

### 🏗️ Arquitetura

O sistema segue o padrão de arquitetura em camadas:

- **Controllers**: Recebem as requisições HTTP e delegam para os serviços
- **Services**: Implementam a lógica de negócio e regras de segurança
- **Guards**: Protegem rotas baseados em autenticação e autorização
- **Strategies**: Implementam estratégias de autenticação (JWT, Local)
- **Repositories**: Acessam o banco de dados (via TypeORM)

## 🌐 Endpoints da API

### 1️⃣ Registro de Usuário

**Endpoint**: `POST /auth/signup`

**Descrição**: Cria uma nova conta de usuário e envia um email de verificação.

**Corpo da Requisição**:

```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "Senha@123"
}
```

**Resposta de Sucesso** (200):

```json
{
  "message": "User registered successfully. Please check your email for verification instructions."
}
```

**Erros Possíveis**:

- `409 Conflict`: Email já cadastrado
- `400 Bad Request`: Dados inválidos (ex. senha fraca)

### 2️⃣ Login (Autenticação)

**Endpoint**: `POST /auth/signin`

**Descrição**: Autentica um usuário e retorna tokens de acesso ou inicia fluxo 2FA.

**Corpo da Requisição**:

```json
{
  "email": "joao@exemplo.com",
  "password": "Senha@123"
}
```

**Resposta de Sucesso** (200):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "a2e8e3f5-1c3d-4c5f-9e8a-7c3d1e9a8b7e",
  "expires_in": 1800
}
```

**Resposta com 2FA** (200):

```json
{
  "message": "Verification code sent to your email",
  "requiresTwoFA": true
}
```

**Erros Possíveis**:

- `401 Unauthorized`: Credenciais inválidas
- `403 Forbidden`: Conta temporariamente bloqueada
- `401 Unauthorized`: Conta não verificada

### 3️⃣ Verificação de 2FA

**Endpoint**: `POST /auth/verify/2fa-code`

**Descrição**: Valida o código 2FA e completa a autenticação.

**Corpo da Requisição**:

```json
{
  "email": "joao@exemplo.com",
  "verificationCode": "123456"
}
```

**Resposta de Sucesso** (200):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "a2e8e3f5-1c3d-4c5f-9e8a-7c3d1e9a8b7e",
  "expires_in": 1800
}
```

**Erros Possíveis**:

- `400 Bad Request`: Código inválido ou expirado
- `401 Unauthorized`: Muitas tentativas de verificação

### 4️⃣ Renovação de Tokens

**Endpoint**: `POST /auth/token/refresh`

**Descrição**: Obtém um novo access token usando o refresh token.

**Corpo da Requisição**:

```json
{
  "refreshToken": "a2e8e3f5-1c3d-4c5f-9e8a-7c3d1e9a8b7e"
}
```

**Resposta de Sucesso** (200):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "b3f6d4e2-2d4e-5d6f-0f1a-8d4e2f3a9c8b",
  "expiresIn": 1800
}
```

**Erros Possíveis**:

- `401 Unauthorized`: Refresh token inválido, expirado ou revogado
- `401 Unauthorized`: Sessão invalidada por mudança de IP (segurança)

### 5️⃣ Verificação de Email

**Endpoint**: `GET /auth/verify/email?token=xyz...`

**Descrição**: Verifica o email do usuário através do token enviado.

**Resposta de Sucesso** (200):

```json
{
  "message": "Email verified successfully"
}
```

**Erros Possíveis**:

- `400 Bad Request`: Token inválido ou expirado
- `404 Not Found`: Usuário não encontrado
- `409 Conflict`: Email já verificado

### 6️⃣ Esqueci Minha Senha

**Endpoint**: `POST /auth/password/forgot-password`

**Descrição**: Envia email com instruções para redefinir a senha.

**Corpo da Requisição**:

```json
{
  "email": "joao@exemplo.com"
}
```

**Resposta de Sucesso** (200):

```json
{
  "message": "If your email is registered, you will receive reset instructions"
}
```

### 7️⃣ Redefinir Senha

**Endpoint**: `POST /auth/password/reset-password?token=xyz...`

**Descrição**: Define uma nova senha usando o token recebido por email.

**Corpo da Requisição**:

```json
{
  "newPassword": "NovaSenha@123"
}
```

**Resposta de Sucesso** (200):

```json
{
  "message": "Password reset successfully"
}
```

**Erros Possíveis**:

- `400 Bad Request`: Token inválido ou expirado
- `400 Bad Request`: Senha fraca
- `409 Conflict`: Nova senha igual à anterior

### 8️⃣ Logout

**Endpoint**: `POST /auth/session/signout`

**Descrição**: Encerra a sessão do usuário, invalidando os tokens.

**Cabeçalhos**:

- `Authorization: Bearer {access_token}`

**Corpo da Requisição**:

```json
{
  "refreshToken": "a2e8e3f5-1c3d-4c5f-9e8a-7c3d1e9a8b7e"
}
```

**Resposta de Sucesso** (200):

```json
{
  "message": "Logout successful"
}
```

### 9️⃣ Perfil do Usuário

**Endpoint**: `GET /auth/session/me`

**Descrição**: Retorna os dados do usuário autenticado.

**Cabeçalhos**:

- `Authorization: Bearer {access_token}`

**Resposta de Sucesso** (200):

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "role": "user"
}
```

## 🔑 Tokens e Segurança

### Tipos de Tokens

1. **Access Token (JWT)**

   - **Formato**: JSON Web Token (JWT)
   - **Conteúdo**: `sub` (userId), `email`, `name`, `role`, `jti` (identificador único)
   - **Expiração**: 30 minutos por padrão (configurável)
   - **Uso**: Autenticação de requisições via header `Authorization: Bearer {token}`

2. **Refresh Token**
   - **Formato**: UUID v4 armazenado no banco de dados
   - **Metadados**: IP, User-Agent, data de criação e expiração
   - **Expiração**: 7 dias por padrão (configurável)
   - **Uso**: Obter novos access tokens sem nova autenticação

### Políticas de Segurança

1. **Proteção contra Força Bruta**

   - Bloqueio temporário após 5 tentativas falhas de login
   - Tempo de bloqueio configurável (padrão: 15 minutos)

2. **Limitação de Taxa (Rate Limiting)**

   - Login: 5 tentativas por minuto
   - Refresh Token: 5 tentativas por minuto
   - Redefinição de Senha: 3 tentativas a cada 5 minutos

3. **Segurança de Tokens**

   - Invalidação imediata no logout
   - Detecção de anomalias (IP diferente no refresh)
   - Limite de 5 sessões ativas por usuário

4. **Requisitos de Senha**

   - Mínimo de 8 e máximo de 20 caracteres
   - Ao menos uma letra maiúscula
   - Ao menos uma letra minúscula
   - Ao menos um número
   - Ao menos um caractere especial

5. **Autenticação em Duas Etapas (2FA)**
   - Obrigatória para contas administrativas
   - Código de 6 dígitos enviado por email
   - Expiração em 10 minutos
   - Limite de 5 tentativas por código

## 📱 Guia para o Frontend

### Fluxo de Usuário Básico

1. **Registro e Verificação**

   ```
   Cadastro → Receber Email → Clicar no Link → Conta Verificada → Login
   ```

2. **Login com 2FA**

   ```
   Login → Receber Código → Inserir Código → Receber Tokens → Usar API
   ```

3. **Renovação Automática de Token**

   ```
   Token Expira → Usar Refresh Token → Receber Novos Tokens → Continuar
   ```

4. **Recuperação de Senha**
   ```
   Esqueci Senha → Receber Email → Clicar no Link → Definir Nova Senha → Login
   ```

### Boas Práticas

1. **Armazenamento Seguro de Tokens**

   - Access Token: `localStorage` ou `sessionStorage` (trade-off segurança vs. conveniência)
   - Refresh Token: `HttpOnly Cookie` (quando possível) ou armazenamento seguro
   - Alternativa: Refresh Tokens apenas em memória durante a sessão

2. **Gestão de Tokens**

   - Implementar renovação automática quando o access token expirar
   - Renovar proativamente antes da expiração (~5 minutos antes)
   - Limpar todos os tokens no logout

3. **Tratamento de Erros**

   - `401`: Tentar refresh token; se falhar, redirecionar para login
   - `403`: Mostrar mensagem de acesso negado ou conta bloqueada
   - `429`: Implementar backoff exponencial ou mostrar timer de espera

4. **Segurança da Interface**
   - Timeout de inatividade (logout automático após X minutos)
   - Não armazenar dados sensíveis em estado global não-criptografado
   - Evitar XSS sanitizando inputs e outputs

### Exemplo de Implementação (Pseudocódigo)

```javascript
// Serviço de Autenticação

// Login
async function login(email, password) {
  const response = await api.post('/auth/signin', { email, password });

  if (response.requiresTwoFA) {
    // Redirecionar para tela de código 2FA
    return { requiresTwoFA: true };
  }

  // Armazenar tokens
  storeTokens(
    response.access_token,
    response.refresh_token,
    response.expires_in,
  );
  return { success: true };
}

// Renovação de Token
async function refreshTokens() {
  try {
    const refreshToken = getRefreshToken();
    const response = await api.post('/auth/token/refresh', { refreshToken });

    storeTokens(
      response.accessToken,
      response.refreshToken,
      response.expiresIn,
    );
    return true;
  } catch (error) {
    // Se falhar, fazer logout
    logout();
    return false;
  }
}

// Interceptor para adicionar token e renovar quando necessário
api.interceptors.request.use(async (config) => {
  // Adicionar token a todas as requisições
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Verificar se token está próximo de expirar
  if (isTokenExpiringSoon() && !isRefreshingToken) {
    await refreshTokens();
  }

  return config;
});
```

## 📚 Glossário

- **JWT**: JSON Web Token, formato para tokens de acesso
- **2FA**: Autenticação em duas etapas/fatores
- **Refresh Token**: Token de longa duração para obter novos access tokens
- **Access Token**: Token de curta duração para autenticar requisições
- **Rate Limiting**: Limitação de requisições por tempo
- **JTI**: JWT ID, identificador único para cada token JWT

## 🔍 Considerações de Segurança

1. **Nunca transmita senhas em texto plano**
2. **Sempre use HTTPS** para todas as chamadas de API de autenticação
3. **Não armazene informações sensíveis** no lado do cliente além do necessário
4. **Implemente timeouts de sessão** para logout automático
5. **Trate códigos de erro específicos** para melhor experiência do usuário
6. **Valide sempre entradas** antes de enviar ao servidor
7. **Mantenha o usuário informado** sobre atividades de autenticação (login em novo dispositivo, alteração de senha)

---

Esta documentação descreve a implementação atual do sistema de autenticação da Cooperescrita. Para questões específicas de implementação ou problemas de segurança, entre em contato com a equipe de desenvolvimento.
