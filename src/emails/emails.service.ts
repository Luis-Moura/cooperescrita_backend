import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as dotenv from 'dotenv';
import { sendVerificationEmailHtml } from './html/sendVerificationEmailHtml';
import { sendResetPasswordEmailHtml } from './html/sendResetPasswordEmailHtml';
import { sendReportAlertAdminHtml } from './html/sendReportAlertAdminHtml';
import { sendVerificationCodeHtml } from './html/sendVerificationCodeHtml';
dotenv.config();

@Injectable()
export class EmailsService {
  private transporter;

  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  }

  async sendEmail(email: string, subject: string, html?: string) {
    try {
      const info = await this.transporter.sendMail({
        to: email.toLowerCase(),
        subject,
        html,
      });
      console.log('Email enviado:', info.response, '\n');
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async queueEmail(email: string, subject: string, html?: string) {
    await this.emailQueue.add('sendEmail', { email, subject, html });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `${process.env.BASE_URL_FRONTEND}/redirect/verify-account?token=${token}`;
    const html = sendVerificationEmailHtml(url);
    await this.queueEmail(email, 'Verificação de Conta', html);
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const url = `${process.env.BASE_URL_FRONTEND}/redirect/reset-password?token=${token}`;
    const html = sendResetPasswordEmailHtml(url);
    await this.queueEmail(email, 'Redefinição de Senha', html);
  }

  async sendReportAlertAdmin(report: string) {
    const html = sendReportAlertAdminHtml(report);
    await this.queueEmail(process.env.MAIN_ADMIN, 'Security Alert', html);
  }

  async sendVerificationCodeEmail(email: string, code: string) {
    const html = sendVerificationCodeHtml(code);
    await this.queueEmail(email, 'Código de Verificação', html);
  }
}
