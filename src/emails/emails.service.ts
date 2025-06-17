import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as dotenv from 'dotenv';
import { sendVerificationEmailHtml } from './html/sendVerificationEmailHtml';
import { sendResetPasswordEmailHtml } from './html/sendResetPasswordEmailHtml';
import { sendReportAlertAdminHtml } from './html/sendReportAlertAdminHtml';
import { sendVerificationCodeHtml } from './html/sendVerificationCodeHtml';
import { sendReportResolvedNotificationHtml } from './html/sendReportResolvedNotificationHtml';
import { validate } from 'email-validator';
import * as path from 'path';
import * as fs from 'fs';
dotenv.config();

type EmailOptions = {
  priority?: 'high' | 'normal' | 'low';
  attempts?: number;
  backoff?: number;
};

@Injectable()
export class EmailsService {
  private transporter;
  private readonly logger = new Logger(EmailsService.name);
  private readonly defaultOptions: EmailOptions = {
    priority: 'normal',
    attempts: 3,
    backoff: 60000, // 1 minuto entre tentativas
  };

  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {
    this.initializeTransporter();
    this.monitorQueueHealth();
  }

  private initializeTransporter() {
    const isProduction = process.env.NODE_ENV === 'production';

    // Validar configurações críticas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      this.logger.error(
        'Credenciais de email não configuradas! Sistema de emails não irá funcionar.',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true,
      maxConnections: isProduction ? 10 : 5,
      maxMessages: isProduction ? 200 : 100,
      secure: isProduction, // Usar TLS em produção
      connectionTimeout: 10000, // 10 segundos timeout
      greetingTimeout: 5000,
      socketTimeout: 30000,
      debug: !isProduction,
    });

    // Verificar conexão no startup
    this.verifyTransporterConnection();
  }

  private async verifyTransporterConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('✅ Servidor de email conectado e pronto para envio');
    } catch (error) {
      this.logger.error(
        `❌ Erro ao conectar ao servidor de email: ${error.message}`,
        error.stack,
      );
    }
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

      const logoPath = path.resolve(
        __dirname,
        '..',
        '..',
        'src',
        'assets',
        'images',
        'cooperescrita.png',
      );

      this.logger.debug(`Caminho da logo: ${logoPath}`);

      if (!fs.existsSync(logoPath)) {
        this.logger.error(
          `Arquivo da logo não encontrado no caminho: ${logoPath}`,
        );
        throw new Error('Logo file not found');
      }

      const info = await this.transporter.sendMail({
        from: `"Cooperescrita" <${process.env.EMAIL_USER}>`,
        to: normalizedEmail,
        subject,
        html,
        attachments: [
          {
            filename: 'logo.png',
            path: logoPath, // Usando o mesmo caminho que já verificamos acima
            cid: 'logo', // Content-ID para referenciar no HTML
          },
        ],
        headers: {
          'X-Priority': '1', // Alta prioridade
          'X-Cooperescrita-ID': `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        },
      });

      this.logger.log(
        `Email enviado para ${normalizedEmail} (ID: ${info.messageId})`,
      );
      return info;
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
