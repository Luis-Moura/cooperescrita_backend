# 🕙 Módulo de Tarefas Agendadas - Cooperescrita

## 📋 Visão Geral

O módulo de Tarefas (Tasks) da Cooperescrita é responsável por executar operações de manutenção do sistema em períodos programados. Ele utiliza o agendador de tarefas (scheduler) do NestJS para executar rotinas que mantêm a integridade e eficiência da aplicação.

### 🏗️ Arquitetura

O sistema de tarefas agendadas segue uma arquitetura simples e eficaz:

1. **TasksService**: Serviço principal que define e executa as tarefas agendadas
2. **@nestjs/schedule**: Decorator `@Cron` para definir quando as tarefas são executadas
3. **Integração com outros módulos**: Como EmailsService para notificações e UsersRepository para manipulação de dados

## 🔄 Tarefas Agendadas

### 1. Limpeza de Usuários Não Verificados

**Cronograma**: Todos os dias às 3h da manhã (`CronExpression.EVERY_DAY_AT_3AM`)

**Descrição**: Remove contas de usuários que foram criadas há mais de um período configurável (padrão: 24 horas) e que não tiveram seu email verificado.

**Propósito**:

- Prevenir acúmulo de contas inativas no banco de dados
- Reduzir vulnerabilidades de segurança de contas abandonadas
- Manter dados analíticos mais precisos

### 2. Limpeza de Códigos de Verificação Expirados

**Cronograma**: Todos os dias à meia-noite (`CronExpression.EVERY_DAY_AT_MIDNIGHT`)

**Descrição**: Limpa códigos de verificação 2FA e tokens temporários que já expiraram e não são mais válidos.

**Propósito**:

- Melhorar a higiene do banco de dados
- Reduzir dados pessoais armazenados após seu uso
- Minimizar o tamanho do banco de dados

## ⚙️ Configuração

### Variáveis de Ambiente
```

# Tempo (em horas) para considerar uma conta não verificada como expirada

USER_VERIFICATION_EXPIRY_HOURS=24

# Ambiente da aplicação (development/production)

NODE_ENV=development

# Email do administrador para relatórios (usado pelo EmailsService)

MAIN_ADMIN=admin@cooperescrita.com

````

### Customização do Cronograma

As expressões cron podem ser modificadas no código para atender a requisitos específicos. Exemplos de expressões disponíveis:

```typescript
// Exemplos de expressões disponíveis no CronExpression
CronExpression.EVERY_30_MINUTES
CronExpression.EVERY_HOUR
CronExpression.EVERY_DAY_AT_NOON
CronExpression.EVERY_WEEKEND
````

## 🛠️ Como Funciona

### Limpeza de Usuários Não Verificados

1. O sistema calcula a data de corte baseada no tempo configurado
2. Consulta o banco de dados por usuários não verificados criados antes dessa data
3. Se encontrados usuários para remoção:
   - Gera logs detalhados (em ambiente de desenvolvimento)
   - Envia relatório para administrador se o número for significativo (>10)
   - Remove os usuários do banco de dados
4. Registra métricas de execução e tempo de processamento

### Limpeza de Códigos de Verificação

1. Identifica usuários com códigos de verificação expirados
2. Limpa esses códigos (definindo como null)
3. Salva as atualizações no banco de dados
4. Registra logs de resultado

### Relatórios e Notificações

Para operações significativas ou falhas, o sistema:

1. Compila estatísticas relevantes (como idade média das contas, domínios mais comuns)
2. Formata um relatório estruturado
3. Envia para o email administrativo definido na configuração

## 📊 Monitoramento e Troubleshooting

### Logs Disponíveis

O módulo gera logs detalhados para rastrear seu funcionamento:

- **Info**: Início e conclusão de tarefas, contagens de itens afetados
- **Debug**: Detalhes específicos de itens processados (ambiente de desenvolvimento)
- **Warn**: Problemas não críticos, como falha ao enviar relatório
- **Error**: Falhas na execução das tarefas

### Exemplo de Logs

```
[Nest] 18356  - 04/12/2023, 3:00:00 AM     LOG [TasksService] Iniciando limpeza de usuários não verificados...
[Nest] 18356  - 04/12/2023, 3:00:01 AM     LOG [TasksService] Encontrados 15 usuários não verificados para remoção.
[Nest] 18356  - 04/12/2023, 3:00:02 AM     LOG [TasksService] Limpeza concluída. Removidos 15 usuários em 1852ms.
```

### Resolução de Problemas

1. **Tarefa não está executando**:

   - Verifique se o módulo `ScheduleModule` está importado corretamente no AppModule
   - Confirme que não há erros na inicialização da aplicação

2. **Erros durante a execução**:

   - Verifique os logs de erro
   - Confirme que a conexão com o banco de dados está estável
   - Verifique permissões do usuário do banco de dados

3. **Relatórios não estão sendo enviados**:
   - Confirme as configurações do módulo de emails
   - Verifique se `MAIN_ADMIN` está configurado corretamente

## 🔧 Estendendo o Módulo

### Adicionando Nova Tarefa Agendada

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  // ...código existente...

  @Cron(CronExpression.EVERY_WEEK)
  async minhaNovaTaskSemanal() {
    this.logger.log('Iniciando minha tarefa semanal...');

    try {
      // Sua lógica aqui

      this.logger.log('Tarefa semanal concluída com sucesso!');
    } catch (error) {
      this.logger.error(
        `Erro na tarefa semanal: ${error.message}`,
        error.stack,
      );
    }
  }
}
```

### Criando Tarefas Dinâmicas ou Condicionais

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TasksService {
  constructor(
    // ...outras injeções...
    private schedulerRegistry: SchedulerRegistry,
  ) {
    // Criar tarefa condicionalmente
    if (process.env.FEATURE_FLAG_X === 'true') {
      this.createDynamicJob();
    }
  }

  private createDynamicJob() {
    const job = new CronJob('0 0 * * *', () => {
      // Esta função executa todos os dias à meia-noite
      this.logger.log('Executando tarefa dinâmica...');
    });

    this.schedulerRegistry.addCronJob('minha-tarefa-dinamica', job);
    job.start();
  }
}
```

## 🔐 Segurança e Boas Práticas

1. **Operações Destrutivas**

   - Implemente confirmações ou logs detalhados para operações que excluem dados
   - Considere soft-deletes em vez de remoção permanente para dados importantes

2. **Performance**

   - Agende tarefas pesadas para horários de baixo uso do sistema
   - Implemente paginação para processamento de grandes conjuntos de dados

3. **Tolerância a Falhas**

   - Todas as tarefas devem ter tratamento de exceções robusto
   - Considere implementar mecanismo de retry para operações críticas

4. **Logging**
   - Registre métricas de cada execução (itens processados, tempo de execução)
   - Mantenha diferentes níveis de log baseados no ambiente e severidade

## 📚 Referências

- [Documentação do NestJS - Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling)
- [Biblioteca node-cron](https://github.com/node-cron/node-cron)
- [Expressões Cron - Explicação](https://crontab.guru/)

---

Esta documentação descreve o módulo de tarefas agendadas da Cooperescrita. Para questões técnicas ou problemas específicos, entre em contato com a equipe de desenvolvimento.
