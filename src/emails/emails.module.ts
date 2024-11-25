import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { BullModule } from '@nestjs/bull';
import { EmailsProcessor } from './emails.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emails',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 20,
      },
    }),
  ],
  providers: [EmailsService, EmailsProcessor],
  exports: [EmailsService, BullModule],
})
export class EmailsModule {}
