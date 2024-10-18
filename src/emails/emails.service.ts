import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
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

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/verify?token=${token}`;
    try {
      await this.transporter.sendMail({
        to: email,
        subject: 'Verificação de Email',
        html: `Clique <a href="${url}">aqui</a> para verificar seu email.`,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const url = `http://localhost:3000/reset-password?token=${token}`;
    try {
      await this.transporter.sendMail({
        to: email,
        subject: 'Redefinição de Senha',
        html: `Clique <a href="${url}">aqui</a> para redefinir sua senha.`,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
