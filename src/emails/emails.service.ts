import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import { sendVerificationEmailHtml } from './html/sendVerificationEmailHtml';
import { sendResetPasswordEmailHtml } from './html/sendResetPasswordEmailHtml';
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
        to: email,
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
    const url = `${process.env.BASE_URL}/reset-password?token=${token}`;
    const html = sendResetPasswordEmailHtml(url);
    await this.sendEmail(email, 'Redefinição de Senha', html);
  }
}
