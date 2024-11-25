import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailsService } from './emails.service';

@Processor('emails')
export class EmailsProcessor {
  constructor(private readonly emailsService: EmailsService) {}

  @Process('sendEmail')
  async handleSendEmail(job: Job) {
    const { email, subject, html } = job.data;
    await this.emailsService.sendEmail(email, subject, html);
  }
}
