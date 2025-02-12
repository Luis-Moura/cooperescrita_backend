import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { CorrecoesModule } from './correcoesModule/correcoes.module';
import { Correcao } from './correcoesModule/entities/correcao.entity';
import { CorrecaoComments } from './correcoesModule/entities/correcaoComments.entity';
import { CorrecaoFeedback } from './correcoesModule/entities/correcaoFeedback.entity';
import { CorrecaoHighlights } from './correcoesModule/entities/correcaoHighlights.entity';
import { CorrecaoSuggestions } from './correcoesModule/entities/correcaoSuggestions.entity';
import { EmailsModule } from './emails/emails.module';
import { Redacao } from './redacoes/entities/redacao.entity';
import { RedacoesModule } from './redacoes/redacoes.module';
import { TasksModule } from './tasks/tasks.module';
import { TasksService } from './tasks/tasks.service';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
dotenv.config();

const redisUrl = new URL(process.env.REDIS_URL || '');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        User,
        Redacao,
        Correcao,
        CorrecaoComments,
        CorrecaoFeedback,
        CorrecaoHighlights,
        CorrecaoSuggestions,
      ],
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
    }),

    BullModule.forRoot({
      redis: {
        host: redisUrl.hostname,
        port: parseInt(redisUrl.port, 10),
        password: redisUrl.password || undefined,
      },
    }),

    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),

    UsersModule,
    AuthModule,
    EmailsModule,
    TasksModule,
    RedacoesModule,
    CorrecoesModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
