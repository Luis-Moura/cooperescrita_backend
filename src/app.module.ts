import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { EmailsModule } from './emails/emails.module';
import { Redacao } from './redacoes/entities/redacao.entity';
import { RedacoesModule } from './redacoes/redacoes.module';
import { TasksModule } from './tasks/tasks.module';
import { TasksService } from './tasks/tasks.service';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { BullModule } from '@nestjs/bull';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // host: process.env.DATABASE_HOST,
      // port: parseInt(process.env.DATABASE_PORT),
      // username: process.env.DATABASE_USERNAME,
      // password: process.env.DATABASE_PASSWORD,
      // database: process.env.DATABASE_NAME,
      entities: [User, Redacao],
      synchronize: true,
    }),

    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    UsersModule,
    AuthModule,
    EmailsModule,
    TasksModule,
    ScheduleModule.forRoot(),
    RedacoesModule,
  ],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
