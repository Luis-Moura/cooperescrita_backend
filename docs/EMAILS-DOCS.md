# 📧 Módulo de Emails - Cooperescrita

## 📋 Visão Geral

O módulo de emails da Cooperescrita fornece uma interface robusta e confiável para o envio de comunicações por email, utilizando um sistema de filas para garantir a entrega mesmo em caso de falhas temporárias.

### 🏗️ Arquitetura

O sistema de emails segue uma arquitetura baseada em filas:

1. **EmailsService**: Interface principal para enfileirar emails
2. **Bull Queue**: Sistema de filas para processamento assíncrono
3. **EmailsProcessor**: Consumidor que processa os emails da fila
4. **Nodemailer**: Biblioteca para envio efetivo dos emails

![Arquitetura do Módulo de Emails](https://via.placeholder.com/800x400?text=Arquitetura+do+Módulo+de+Emails)

## 🚀 Funcionalidades

- Envio assíncrono de emails (não bloqueia o fluxo principal)
- Tentativas automáticas em caso de falha (retry com backoff exponencial)
- Diferentes prioridades para tipos de email
- Validação de endereços de email
- Monitoramento de saúde da fila
- Logging detalhado para troubleshooting

## 📬 Tipos de Emails Suportados

1. **Emails de Verificação de Conta**: Enviados após registro de usuário
2. **Emails de Redefinição de Senha**: Enviados para recuperação de conta
3. **Códigos de Verificação (2FA)**: Autenticação em duas etapas
4. **Alertas de Segurança**: Notificações para administradores

## 🔧 Como Usar o Módulo

### 1. Injeção de Dependência

Para usar o serviço de emails em qualquer componente da aplicação:

```typescript
import { Injectable } from '@nestjs/common';
import { EmailsService } from 'src/emails/emails.service';

@Injectable()
export class MeuServico {
  constructor(private readonly emailsService: EmailsService) {}
  
  async enviarAlgoImportante() {
    // Usar o serviço de emails aqui
  }
}
```

### 2. Enviando Emails de Verificação

```typescript
// Durante o registro de usuário
async registrarUsuario(userData) {
  // ... lógica de criação do usuário
  
  // Gerar token JWT para verificação
  const token = this.jwtService.sign({ email: user.email });
  
  // Enviar email de verificação
  await this.emailsService.sendVerificationEmail(user.email, token);
  
  // ... retornar resposta
}
```

### 3. Enviando Emails de Redefinição de Senha

```typescript
async solicitarResetSenha(email: string) {
  // ... validar usuário
  
  // Gerar token seguro
  const token = this.jwtService.sign({ sub: user.id, email: user.email });
  
  // Enviar email de redefinição
  await this.emailsService.sendResetPasswordEmail(email, token);
  
  // ... retornar resposta
}
```

### 4. Enviando Códigos 2FA

```typescript
async iniciarAutenticacaoDoisFatores(user) {
  // Gerar código de verificação
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Salvar código no usuário
  user.verificationCode = code;
  user.verificationCodeExpires = new Date(Date.now() + 600000); // 10 minutos
  await this.usersRepository.save(user);
  
  // Enviar código por email
  await this.emailsService.sendVerificationCodeEmail(user.email, code);
}
```

### 5. Enviando Alertas ao Administrador

```typescript
async reportarProblemaSeguranca(detalhes: string) {
  const report = `
    Relatório de Segurança
    Data: ${new Date().toISOString()}
    Detalhes: ${detalhes}
  `;
  
  await this.emailsService.sendReportAlertAdmin(report);
}
```

## ⚙️ Configuração

### Variáveis de Ambiente Necessárias

```
# Credenciais de email
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app

# URLs da aplicação
BASE_URL_FRONTEND=https://seuapp.com

# Email do administrador principal
MAIN_ADMIN=admin@seuapp.com
```

### Requisitos de Credenciais

Para Gmail, recomendamos usar "App Passwords" em vez de senhas regulares:
1. Ative a verificação em duas etapas na sua conta Google
2. Acesse [Senhas de App](https://myaccount.google.com/apppasswords)
3. Gere uma senha específica para a aplicação

## 🔍 Monitoramento e Troubleshooting

### Logs Disponíveis

O módulo de emails gera logs detalhados para facilitar a identificação de problemas:

- **Info**: Emails enviados com sucesso, status da fila
- **Debug**: Detalhes de jobs, tentativas
- **Warn**: Falhas temporárias, emails inválidos
- **Error**: Falhas permanentes, problemas de conexão

### Monitoramento da Fila

Em ambiente de produção, o sistema registra automaticamente o status da fila a cada hora, incluindo:
- Número de jobs ativos
- Número de jobs aguardando
- Número de jobs falhos
- Número de jobs completos

## 🛡️ Segurança e Boas Práticas

1. **Validação de Entradas**
   - Todos os endereços de email são validados antes do envio
   - URLs e tokens são gerados de forma segura

2. **Rate Limiting**
   - Implemente rate limiting no frontend para evitar abusos
   - Limite a frequência com que um usuário pode solicitar emails

3. **Tratamento de Falhas**
   - O sistema tenta reenviar emails automaticamente
   - Emails críticos têm mais tentativas configuradas

4. **Privacidade**
   - Não inclua informações sensíveis no corpo dos emails
   - Use tokens de uso único com expiração adequada

## 📱 Guia para o Frontend

### 1. Fluxo de Verificação de Email

```
Registro → Mostrar tela de "Verifique seu email" → Usuário clica no link no email → Redirecionar para confirmação → Login
```

### 2. Fluxo de Recuperação de Senha

```
Clique em "Esqueci a senha" → Formulário de email → Confirmação de envio → Usuário clica no link no email → Formulário de nova senha → Confirmação → Login
```

### 3. Fluxo de Autenticação 2FA

```
Login → Sistema solicita código 2FA → Usuário recebe código por email → Usuário insere código → Autenticação completa
```

### Boas Práticas na UI

1. **Feedback Claro ao Usuário**
   - Mostrar mensagens de "Email enviado" mesmo se o email não existir (segurança)
   - Incluir instruções para verificar a pasta de spam

2. **Temporizadores de Reenvio**
   - Adicionar contador regressivo para solicitações repetidas (ex: "Reenviar em 60s")
   - Limitar o número total de reenvios por sessão

3. **Validação de Formulários**
   - Validar formato de email no frontend antes de enviar requisição
   - Validar complexidade de senha no formulário de redefinição

4. **Tratamento de Erros**
   - Ter uma abordagem de fallback caso o email não chegue
   - Oferecer canais alternativos de suporte

### Exemplos de Componentes React (Pseudocódigo)

**Formulário de Esqueci Senha:**
```jsx
function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      await api.post('/auth/password/forgot-password', { email });
      setIsSent(true);
      startCountdown(60); // 60 segundos para reenvio
    } catch (error) {
      // Mesmo em caso de erro, mostrar como sucesso para evitar enumeração
      setIsSent(true);
      startCountdown(60);
    }
  }
  
  function startCountdown(seconds) {
    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  
  return (
    <div>
      {!isSent ? (
        <form onSubmit={handleSubmit}>
          <h2>Recuperar Senha</h2>
          <p>Digite seu email para receber instruções de recuperação:</p>
          
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
          />
          
          <button type="submit">Enviar</button>
        </form>
      ) : (
        <div className="success-message">
          <h2>Email Enviado!</h2>
          <p>Enviamos instruções para {email}.</p>
          <p>Por favor, verifique sua caixa de entrada e pasta de spam.</p>
          
          {countdown > 0 ? (
            <button disabled>
              Reenviar em {countdown}s
            </button>
          ) : (
            <button onClick={handleSubmit}>
              Reenviar instruções
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

**Verificação de Código 2FA:**
```jsx
function TwoFactorVerification({ email }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      const response = await api.post('/auth/verify/2fa-code', {
        email,
        verificationCode: code
      });
      
      // Armazenar tokens e redirecionar
      storeAuthTokens(response.data);
      navigate('/dashboard');
    } catch (error) {
      setError('Código inválido ou expirado. Tente novamente.');
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Verificação em Duas Etapas</h2>
      <p>Digite o código de 6 dígitos enviado para {email}</p>
      
      <input
        type="text"
        pattern="[0-9]{6}"
        maxLength={6}
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="000000"
        required
      />
      
      {error && <p className="error">{error}</p>}
      
      <button type="submit">Verificar</button>
    </form>
  );
}
```

## 📚 Referências

- [Documentação do Bull Queue](https://github.com/OptimalBits/bull/blob/master/REFERENCE.md)
- [Documentação do Nodemailer](https://nodemailer.com/about/)
- [Boas Práticas para Email Transacional](https://postmarkapp.com/blog/best-practices-for-transactional-email)

---

Esta documentação descreve o sistema de emails da Cooperescrita. Para questões técnicas ou problemas específicos, entre em contato com a equipe de desenvolvimento.
