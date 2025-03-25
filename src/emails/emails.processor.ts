import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailsService } from './emails.service';
import { Logger } from '@nestjs/common';

@Processor('emails')
export class EmailsProcessor {
  private readonly logger = new Logger(EmailsProcessor.name);

  constructor(private readonly emailsService: EmailsService) {}

  @Process('sendEmail')
  async handleSendEmail(job: Job) {
    const { email, subject, html } = job.data;

    this.logger.debug(
      `Processando job #${job.id}: email para ${email} (tentativa ${job.attemptsMade + 1})`,
    );

    try {
      await this.emailsService.sendEmail(email, subject, html);
      this.logger.debug(`Job #${job.id} concluído com sucesso`);
      return { success: true, email };
    } catch (error) {
      // Se for a última tentativa, registramos como erro crítico
      if (job.attemptsMade >= job.opts.attempts - 1) {
        this.logger.error(
          `Job #${job.id} falhou em todas as ${job.opts.attempts} tentativas: ${error.message}`,
        );
      } else {
        this.logger.warn(
          `Job #${job.id} falhou na tentativa ${job.attemptsMade + 1}: ${error.message}. Agendando nova tentativa.`,
        );
      }

      // Propagar o erro para que o Bull possa fazer retry
      throw error;
    }
  }
}
