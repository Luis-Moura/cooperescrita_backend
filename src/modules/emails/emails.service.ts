import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Resend } from 'resend';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as dotenv from 'dotenv';
import { sendVerificationEmailHtml } from './html/sendVerificationEmailHtml';
import { sendResetPasswordEmailHtml } from './html/sendResetPasswordEmailHtml';
import { sendReportAlertAdminHtml } from './html/sendReportAlertAdminHtml';
import { sendVerificationCodeHtml } from './html/sendVerificationCodeHtml';
import { sendReportResolvedNotificationHtml } from './html/sendReportResolvedNotificationHtml';
import { validate } from 'email-validator';
dotenv.config();

type EmailOptions = {
  priority?: 'high' | 'normal' | 'low';
  attempts?: number;
  backoff?: number;
};

@Injectable()
export class EmailsService {
  private resend: Resend;
  private readonly logger = new Logger(EmailsService.name);
  private readonly defaultOptions: EmailOptions = {
    priority: 'normal',
    attempts: 3,
    backoff: 60000, // 1 minuto entre tentativas
  };

  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {
    this.initializeResend();
    this.monitorQueueHealth();
  }

  private initializeResend() {
    // Validar configurações críticas
    if (!process.env.RESEND_API_KEY) {
      this.logger.error(
        'RESEND_API_KEY não configurada! Sistema de emails não irá funcionar.',
      );
      return;
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.logger.log('✅ Cliente Resend inicializado e pronto para envio');
  }

  private monitorQueueHealth() {
    this.emailQueue.on('error', (error) => {
      this.logger.error(
        `Erro na fila de emails: ${error.message}`,
        error.stack,
      );
    });

    this.emailQueue.on('failed', (job, error) => {
      const { email, subject } = job.data;
      this.logger.warn(
        `Email para ${email} com assunto "${subject}" falhou após ${job.attemptsMade} tentativas: ${error.message}`,
      );
    });

    // Log periódico do status da fila (a cada 1h em produção)
    if (process.env.NODE_ENV === 'production') {
      setInterval(async () => {
        const counts = await this.emailQueue.getJobCounts();
        this.logger.log(`Status da fila de emails: ${JSON.stringify(counts)}`);
      }, 3600000);
    }
  }

  async sendEmail(email: string, subject: string, html?: string) {
    try {
      // Validar email antes do envio
      if (!this.validateEmail(email)) {
        this.logger.warn(`Tentativa de envio para email inválido: ${email}`);
        throw new Error('Invalid email address');
      }

      const normalizedEmail = email.toLowerCase().trim();

      if (!this.resend) {
        throw new Error('Resend client not initialized');
      }

      // const fromEmail =
      //   process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      const { data, error } = await this.resend.emails.send({
        from: `contato@cooperescrita.com`,
        to: [normalizedEmail],
        subject,
        html,
        headers: {
          'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      this.logger.log(
        `Email enviado para ${normalizedEmail} (ID: ${data?.id})`,
      );
      return data;
    } catch (error) {
      this.logger.error(
        `Falha ao enviar email para ${email}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Falha ao enviar email. Por favor, tente novamente mais tarde.',
      );
    }
  }

  async queueEmail(
    email: string,
    subject: string,
    html?: string,
    options: EmailOptions = {},
  ) {
    const mergedOptions = { ...this.defaultOptions, ...options };

    try {
      if (!this.validateEmail(email)) {
        this.logger.warn(`Email inválido rejeitado na fila: ${email}`);
        return false;
      }

      const normalizedEmail = email.toLowerCase().trim();

      const job = await this.emailQueue.add(
        'sendEmail',
        {
          email: normalizedEmail,
          subject,
          html,
        },
        {
          priority: this.getPriorityValue(mergedOptions.priority),
          attempts: mergedOptions.attempts,
          backoff: {
            type: 'exponential',
            delay: mergedOptions.backoff,
          },
          removeOnComplete: true,
          removeOnFail: 100, // Manter histórico limitado de falhas
        },
      );

      this.logger.debug(
        `Email para ${normalizedEmail} enfileirado com sucesso (JobID: ${job.id})`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Erro ao enfileirar email para ${email}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `${process.env.BASE_URL_FRONTEND}/redirect/verify-account?token=${token}`;
    const html = sendVerificationEmailHtml(url);

    const success = await this.queueEmail(
      email,
      'Verificação de Conta - Cooperescrita',
      html,
      { priority: 'high' }, // Alta prioridade para emails de verificação
    );

    if (success) {
      this.logger.log(`Email de verificação enviado para: ${email}`);
    }
    return success;
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const url = `${process.env.BASE_URL_FRONTEND}/redirect/reset-password?token=${token}`;
    const html = sendResetPasswordEmailHtml(url);

    const success = await this.queueEmail(
      email,
      'Redefinição de Senha - Cooperescrita',
      html,
      { priority: 'high', attempts: 5 }, // Mais tentativas para emails críticos
    );

    if (success) {
      this.logger.log(`Email de redefinição de senha enviado para: ${email}`);
    }
    return success;
  }

  async sendReportAlertAdmin(report: string) {
    if (!process.env.MAIN_ADMIN) {
      this.logger.error('Email de administrador não configurado para alertas');
      return false;
    }

    const html = sendReportAlertAdminHtml(report);

    const success = await this.queueEmail(
      process.env.MAIN_ADMIN,
      '🚨 Alerta de Segurança - Cooperescrita',
      html,
      { priority: 'high', attempts: 10, backoff: 30000 }, // Tentativas frequentes para alertas
    );

    if (success) {
      this.logger.log(`Alerta de segurança enviado ao administrador`);
    }
    return success;
  }

  async sendReportResolvedNotification(
    reportOwnerEmail: string,
    reportType: 'redacao' | 'correcao',
    reportId: string,
    resolution: 'analisado' | 'rejeitado',
    wasContentDeleted: boolean,
    adminNote?: string,
  ) {
    const subjectMap = {
      analisado: 'Report Analisado',
      rejeitado: 'Report Rejeitado',
    };

    const html = sendReportResolvedNotificationHtml(
      reportId,
      reportType,
      resolution,
      wasContentDeleted,
      adminNote,
    );

    const success = await this.queueEmail(
      reportOwnerEmail,
      `${subjectMap[resolution]} - Cooperescrita`,
      html,
      { priority: 'normal' },
    );

    if (success) {
      this.logger.log(
        `Notificação de report ${resolution} enviada para: ${reportOwnerEmail}`,
      );
    }
    return success;
  }

  async sendVerificationCodeEmail(email: string, code: string) {
    const html = sendVerificationCodeHtml(code);

    const success = await this.queueEmail(
      email,
      'Código de Verificação - Cooperescrita',
      html,
      { priority: 'high' },
    );

    if (success) {
      this.logger.log(`Código de verificação 2FA enviado para: ${email}`);
    }
    return success;
  }

  // Helpers
  private validateEmail(email: string): boolean {
    return validate(email);
  }

  private getPriorityValue(priority: string): number {
    switch (priority) {
      case 'high':
        return 1;
      case 'low':
        return 3;
      default:
        return 2; // normal
    }
  }
}
