Coletando informações do workspace# 🔧 Módulo de Administração - Cooperescrita

## 📋 Visão Geral

O módulo de administração da Cooperescrita fornece funcionalidades completas para gerenciar usuários, redações, correções e reports do sistema. Todas as rotas requerem autenticação JWT e privilégios de administrador.

## 🔑 Autenticação

Todas as requisições devem incluir o header:
```
Authorization: Bearer {access_token}
```

## 👥 Gerenciamento de Usuários

### Buscar Usuário por Email
```http
GET /admin/users/find-by-email?email=usuario@exemplo.com
```

**Resposta**:
```json
{
  "id": "uuid",
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "role": "user",
  "verified": true,
  "active": true
}
```

### Buscar Usuário por Nome
```http
GET /admin/users/find-by-name?name=João
```

### Listar Usuários
```http
GET /admin/users/list?page=1&limit=10&search=silva&role=user
```

**Parâmetros**:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `search`: Buscar em nome e email
- `role`: Filtrar por `user` ou `admin`

**Resposta**:
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "Nome",
      "email": "email@exemplo.com",
      "role": "user",
      "verified": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "active": true
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Ativar/Desativar Usuário
```http
POST /admin/users/{userId}/toggle-status
```

### Deletar Usuário
```http
DELETE /admin/users/delete-by-email
Content-Type: application/json

{
  "email": "usuario@exemplo.com"
}
```

## 📝 Gerenciamento de Redações

### Visualizar Redação
```http
GET /admin/redacoes/{id}
```

### Listar Redações
```http
GET /admin/redacoes?limit=20&offset=0&status=enviado&userId=uuid&search=tema
```

**Parâmetros**:
- `limit`: Itens por página (padrão: 20)
- `offset`: Deslocamento (padrão: 0)
- `status`: `enviado` ou `rascunho`
- `userId`: Filtrar por autor
- `search`: Buscar em título e tópico

### Deletar Redação
```http
DELETE /admin/redacoes/{id}
```

## ✏️ Gerenciamento de Correções

### Visualizar Correção
```http
GET /admin/correcoes/{id}
```

### Listar Correções
```http
GET /admin/correcoes?limit=20&offset=0&status=enviado&corretorId=uuid&redacaoId=123
```

**Parâmetros**:
- `limit`: Itens por página (padrão: 20)
- `offset`: Deslocamento (padrão: 0)
- `status`: `enviado` ou `rascunho`
- `corretorId`: Filtrar por corretor
- `redacaoId`: Filtrar por redação

### Deletar Correção
```http
DELETE /admin/correcoes/{id}
```

## 🚨 Gerenciamento de Reports

### Listar Reports de Redações
```http
GET /admin/reports/redacoes?limit=20&offset=0&status=pendente&motivo=spam
```

### Listar Reports de Correções
```http
GET /admin/reports/correcoes?limit=20&offset=0&status=pendente&motivo=ofensivo
```

**Parâmetros de Filtro**:
- `status`: `pendente`, `analisado`, `rejeitado`
- `motivo`: `conteudo_inadequado`, `spam`, `plagio`, `ofensivo`, `outro`
- `dataInicial`: Data inicial (ISO string)
- `dataFinal`: Data final (ISO string)

### Resolver Report de Redação
```http
PATCH /admin/reports/redacao/{reportId}/resolve
Content-Type: application/json

{
  "acao": "analisado",
  "observacoes": "Conteúdo adequado após análise",
  "deletarConteudo": false
}
```

### Resolver Report de Correção
```http
PATCH /admin/reports/correcao/{reportId}/resolve
Content-Type: application/json

{
  "acao": "analisado",
  "observacoes": "Report válido - conteúdo removido",
  "deletarConteudo": true
}
```

### Estatísticas de Reports
```http
GET /admin/reports/stats
```

**Resposta**:
```json
{
  "totalRedacaoReports": 45,
  "totalCorrecaoReports": 23,
  "pendingRedacaoReports": 12,
  "pendingCorrecaoReports": 8,
  "redacaoMotivos": [
    { "motivo": "spam", "count": "15" },
    { "motivo": "ofensivo", "count": "10" }
  ],
  "correcaoMotivos": [...],
  "redacaoTrend": [...],
  "correcaoTrend": [...]
}
```

## 🔐 Autenticação de Admin

### Registrar Novo Admin
```http
POST /admin/auth/signup
Content-Type: application/json

{
  "name": "Admin Nome",
  "email": "admin@exemplo.com",
  "password": "SenhaSegura@123"
}
```

> **Nota**: Apenas administradores podem criar novas contas de administrador.

## 💡 Guia para Frontend

### Estrutura de Estado Recomendada

```javascript
const adminState = {
  users: {
    list: [],
    total: 0,
    loading: false,
    filters: { page: 1, limit: 10, search: '', role: '' }
  },
  redacoes: {
    list: [],
    total: 0,
    loading: false,
    filters: { limit: 20, offset: 0, status: '', userId: '', search: '' }
  },
  correcoes: {
    list: [],
    total: 0,
    loading: false,
    filters: { limit: 20, offset: 0, status: '', corretorId: '', redacaoId: '' }
  },
  reports: {
    redacoes: [],
    correcoes: [],
    stats: {},
    loading: false,
    filters: { status: 'pendente', motivo: '' }
  }
};
```

### Tratamento de Erros

```javascript
async function handleAdminRequest(apiCall) {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      // Redirecionar para página de acesso negado
      router.push('/access-denied');
    } else if (error.response?.status === 404) {
      // Mostrar mensagem de "não encontrado"
      toast.error('Item não encontrado');
    } else {
      // Erro genérico
      toast.error('Erro interno do servidor');
    }
    throw error;
  }
}
```

### Componente de Listagem Exemplo

```jsx
function AdminUsersList() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await api.get('/admin/users/list', { params: filters });
      setUsers(data.users);
    } catch (error) {
      handleAdminRequest(() => Promise.reject(error));
    } finally {
      setLoading(false);
    }
  }

  async function toggleUserStatus(userId) {
    try {
      await api.post(`/admin/users/${userId}/toggle-status`);
      toast.success('Status alterado com sucesso');
      loadUsers(); // Recarregar lista
    } catch (error) {
      handleAdminRequest(() => Promise.reject(error));
    }
  }

  // ... resto do componente
}
```

### Resolução de Reports

```javascript
async function resolveReport(reportId, tipo, acao, observacoes, deletarConteudo) {
  const endpoint = tipo === 'redacao' 
    ? `/admin/reports/redacao/${reportId}/resolve`
    : `/admin/reports/correcao/${reportId}/resolve`;

  try {
    await api.patch(endpoint, {
      acao,
      observacoes,
      deletarConteudo
    });
    
    toast.success('Report resolvido com sucesso');
    // Recarregar lista de reports
    loadReports();
  } catch (error) {
    handleAdminRequest(() => Promise.reject(error));
  }
}
```

## ⚠️ Considerações Importantes

1. **Rate Limiting**: Algumas operações têm limites de taxa (ex: 10 deleções por 5 minutos)
2. **Logs**: Todas as ações administrativas são registradas nos logs do sistema
3. **Notificações**: Operações críticas geram emails de notificação para o admin principal
4. **Proteções**: O admin principal (definido em `MAIN_ADMIN`) não pode ser modificado por outros admins

## 🔍 Códigos de Status HTTP

- `200`: Sucesso
- `401`: Não autorizado (token inválido)
- `403`: Acesso negado (não é admin ou tentativa de modificar admin principal)
- `404`: Recurso não encontrado
- `409`: Conflito (ex: usuário já existe)
- `429`: Muitas tentativas (rate limiting)
- `500`: Erro interno do servidor

---

Esta documentação cobre as principais funcionalidades do módulo de administração. Para questões específicas ou problemas técnicos, consulte os logs do sistema ou entre em contato com a equipe de desenvolvimento.