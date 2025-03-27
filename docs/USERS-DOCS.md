# 👤 Módulo de Usuários - Cooperescrita

## 📋 Visão Geral

O módulo de Usuários da Cooperescrita gerencia todo o ciclo de vida das contas de usuário, incluindo perfis, autenticação, segurança e gerenciamento administrativo. O sistema implementa práticas modernas de segurança como soft delete, auditoria de mudanças sensíveis e proteções especiais para contas administrativas.

### 🏗️ Arquitetura

O módulo de usuários segue uma arquitetura em camadas:

1. **Controllers**: Recebem requisições HTTP e delegam para os serviços
2. **Services**: Implementam a lógica de negócio e regras de acesso
3. **Entidades**: Definem o modelo de dados e relacionamentos
4. **DTOs**: Estruturam e validam dados de entrada
5. **Utilitários**: Fornecem funcionalidades compartilhadas

## 🧩 Componentes Principais

### Entidade User

A entidade `User` representa um usuário no sistema e armazena:

- **Informações básicas**: Nome, email, senha
- **Status**: Verificação, ativação/desativação
- **Segurança**: Controle de falhas de login, bloqueio de conta
- **Preferências**: Configurações como 2FA
- **Relacionamentos**: Redações, correções, comentários

### Serviços

1. **AccountService**: Gerencia operações relacionadas à conta do próprio usuário
2. **AdminService**: Fornece funcionalidades administrativas para gerenciar outros usuários
3. **UtilsService**: Oferece utilitários compartilhados para consulta de usuários

### Controllers

1. **AccountController**: Expõe endpoints para o usuário gerenciar sua própria conta
2. **AdminController**: Expõe endpoints administrativos para gerenciar outras contas

## 🔑 Funcionalidades Principais

### Gerenciamento de Perfil

- **Visualização de perfil**: Acesso aos dados da própria conta
- **Atualização de perfil**: Modificação de dados pessoais
- **Alteração de senha**: Com validação de senha atual

### Segurança da Conta

- **Autenticação em duas etapas (2FA)**: Ativação/desativação de 2FA
- **Soft delete**: Exclusão não destrutiva de contas
- **Notificações de segurança**: Emails para mudanças sensíveis

### Administração de Usuários

- **Busca de usuários**: Por email ou nome
- **Listagem paginada**: Com filtros e ordenação
- **Gerenciamento de status**: Ativação/desativação de contas
- **Exclusão administrativa**: Com proteções especiais

## 🌐 Endpoints da API

### Endpoints da Conta do Usuário

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/users/account/me` | Retorna o perfil do usuário atual | JWT |
| PUT | `/users/account/profile` | Atualiza o perfil do usuário | JWT |
| POST | `/users/account/change-password` | Altera a senha do usuário | JWT |
| POST | `/users/account/activate-twoFA` | Ativa autenticação em duas etapas | JWT |
| POST | `/users/account/desativate-twoFA` | Desativa autenticação em duas etapas | JWT |
| DELETE | `/users/account/delete-account` | Exclui a própria conta (soft delete) | JWT |

### Endpoints Administrativos

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/admin/users/find-by-email` | Busca usuário por email | JWT + Admin |
| GET | `/admin/users/find-by-name` | Busca usuário por nome | JWT + Admin |
| GET | `/admin/users/list` | Lista usuários com paginação e filtros | JWT + Admin |
| DELETE | `/admin/users/delete-by-email` | Exclui conta de usuário (soft delete) | JWT + Admin |
| POST | `/admin/users/:userId/toggle-status` | Ativa/desativa conta de usuário | JWT + Admin |

## 📝 DTOs e Validações

### DTOs de Conta

1. **ChangePasswordDto**
   - Validações rigorosas de senha (maiúsculas, minúsculas, caracteres especiais)
   - Distinção entre senha atual e nova senha

2. **UpdateProfileDto**
   - Validações de comprimento do nome
   - Campos opcionais para atualizações parciais

### DTOs Administrativos

1. **FindByEmailDto**
   - Validação de formato de email

2. **FindByNameDto**
   - Validação de comprimento mínimo para evitar buscas muito amplas

3. **PaginationDto**
   - Suporte para paginação, filtros e ordenação

## 🔐 Segurança e Proteções

### Proteção de Dados

1. **Soft Delete**
   - As contas não são excluídas permanentemente
   - Dados são anonimizados (email transformado)
   - Timestamp de desativação é registrado

2. **Proteção do Admin Principal**
   - A conta admin principal (definida em `MAIN_ADMIN`) não pode ser:
     - Excluída
     - Desativada 
     - Acessada por outros administradores

3. **Autorização Refinada**
   - Apenas o admin principal pode gerenciar outros admins
   - Verificações detalhadas antes de operações sensíveis

### Auditoria e Logging

1. **Logs de Atividade**
   - Operações sensíveis são registradas com detalhes
   - Tentativas de acesso administrativo são monitoradas

2. **Notificações de Segurança**
   - Emails enviados quando:
     - Senhas são alteradas
     - 2FA é ativado/desativado
     - Conta é deletada ou suspensa

3. **Alertas de Segurança**
   - Tentativas de acessar/modificar a conta admin principal geram alertas

## 📊 Exemplo de Uso da API

### Atualizar Perfil

**Requisição**:
```http
PUT /users/account/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "Novo Nome de Usuário"
}
```

**Resposta**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Novo Nome de Usuário",
    "email": "usuario@exemplo.com",
    "role": "user"
  }
}
```

### Listar Usuários (Admin)

**Requisição**:
```http
GET /admin/users/list?page=1&limit=10&role=user&search=silva
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta**:
```json
{
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Maria Silva",
      "email": "maria@exemplo.com",
      "role": "user",
      "verified": true,
      "createdAt": "2023-05-17T14:20:30.000Z",
      "active": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "role": "user",
      "verified": true,
      "createdAt": "2023-06-10T09:15:22.000Z",
      "active": true
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

## 🔄 Integrações

### Integração com o Módulo de Token

O módulo de Usuários integra-se com o módulo de Token para:
- Revogar todos os tokens ao desativar uma conta
- Garantir que usuários inativos não possam autenticar-se

### Integração com o Módulo de Emails

O módulo de Usuários integra-se com o módulo de Emails para:
- Enviar notificações de segurança 
- Alertar sobre alterações sensíveis na conta
- Informar sobre ações administrativas

## ⚙️ Configurações

### Variáveis de Ambiente

```
# Admin principal (protegido contra exclusão/desativação)
MAIN_ADMIN=admin@cooperescrita.com
```

## 🔍 Melhores Práticas Implementadas

1. **Validação Robusta**
   - Todos os inputs são validados com class-validator
   - Senhas exigem alto nível de complexidade

2. **Rate Limiting**
   - Operações sensíveis têm limites de taxa
   - Proteção contra abuso de API

3. **Logs Estruturados**
   - Logs utilizando o Logger do NestJS
   - Diferentes níveis de severidade para diversos eventos

4. **Erros Descritivos**
   - Mensagens de erro específicas, mas seguras
   - Exceções tipadas para facilitar o tratamento no cliente

## 🚫 Considerações de Segurança

1. **Armazenamento de Senhas**
   - Senhas armazenadas com hash bcrypt
   - Verificação do histórico para evitar reutilização

2. **Proteção contra Enumeração**
   - Respostas consistentes para prevenir enumeração de usuários

3. **Princípio do Menor Privilégio**
   - Usuários só podem acessar/modificar seus próprios dados
   - Permissões administrativas apenas quando necessário

## 📚 Referências

- [Documentação do NestJS](https://docs.nestjs.com/)
- [Documentação do TypeORM](https://typeorm.io/)
- [Melhores práticas de segurança OWASP](https://owasp.org/www-project-top-ten/)

---

Esta documentação descreve o módulo de Usuários da Cooperescrita. Para questões técnicas ou problemas específicos, entre em contato com a equipe de desenvolvimento.
