import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
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
    await this.transporter.sendMail({
      to: email,
      subject: 'Verificação de Email',
      html: `Clique <a href="${url}">aqui</a> para verificar seu email.`,
    });
  }
}
