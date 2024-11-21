import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import { sendVerificationEmailHtml } from './html/sendVerificationEmailHtml';
import { sendResetPasswordEmailHtml } from './html/sendResetPasswordEmailHtml';
import { sendReportAlertAdminHtml } from './html/sendReportAlertAdminHtml';
import { sendVerificationCodeHtml } from './html/sendVerificationCodeHtml';
dotenv.config();

@Injectable()
export class EmailsService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private async sendEmail(email: string, subject: string, html?: string) {
    try {
      await this.transporter.sendMail({
        to: email.toLowerCase(),
        subject,
        html,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `${process.env.BASE_URL}/verify-account?token=${token}`;
    const html = sendVerificationEmailHtml(url);
    await this.sendEmail(email, 'Verificação de Conta', html);
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const url = `${process.env.BASE_URL_FRONTEND}/redirect/reset-password?token=${token}`;
    const html = sendResetPasswordEmailHtml(url);
    await this.sendEmail(email, 'Redefinição de Senha', html);
  }

  async sendReportAlertAdmin(report: string) {
    const html = sendReportAlertAdminHtml(report);
    await this.sendEmail(process.env.MAIN_ADMIN, 'Security Alert', html);
  }

  async sendVerificationCodeEmail(email: string, code: string) {
    const html = sendVerificationCodeHtml(code);
    await this.sendEmail(email, 'Código de Verificação', html);
  }
}
