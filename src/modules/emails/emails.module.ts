import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { BullModule } from '@nestjs/bull';
import { EmailsProcessor } from './emails.processor';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Garantir acesso às variáveis de ambiente
    BullModule.registerQueue({
      name: 'emails',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100, // Manter histórico das últimas 100 falhas
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000, // 1 minuto inicial entre tentativas
        },
      },
      settings: {
        stalledInterval: 300000, // Verificar jobs parados a cada 5 minutos
        maxStalledCount: 2, // Número de vezes que um job pode travar antes de ser considerado falho
        drainDelay: 5000, // Intervalo entre verificações da fila
      },
    }),
  ],
  providers: [EmailsService, EmailsProcessor],
  exports: [EmailsService, BullModule],
})
export class EmailsModule {}
