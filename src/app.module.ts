import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { CorrecoesModule } from './modules/correcoesModule/correcoes.module';
import { Correcao } from './modules/correcoesModule/entities/correcao.entity';
import { CorrecaoComments } from './modules/correcoesModule/entities/correcaoComments.entity';
import { CorrecaoFeedback } from './modules/correcoesModule/entities/correcaoFeedback.entity';
import { CorrecaoHighlights } from './modules/correcoesModule/entities/correcaoHighlights.entity';
import { CorrecaoSuggestions } from './modules/correcoesModule/entities/correcaoSuggestions.entity';
import { EmailsModule } from './modules/emails/emails.module';
import { Redacao } from './modules/redacoesModule/entities/redacao.entity';
import { RedacaoComments } from './modules/redacoesModule/entities/redacaoComments.entity';
import { RedacoesModule } from './modules/redacoesModule/redacoes.module';
import { ReportsModule } from './modules/reportsModule/reports.module';
import { RedacaoReport } from './modules/reportsModule/entities/redacaoReport.entity';
import { CorrecaoReport } from './modules/reportsModule/entities/correcaoReport.entity';
import { TasksModule } from './modules/tasks/tasks.module';
import { RefreshToken } from './modules/token/entities/refreshToken.entity';
import { TokenModule } from './modules/token/token.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DashboardModule } from './modules/dashboard/dashboard.module';

dotenv.config();

const redisUrl = new URL(process.env.REDIS_URL || '');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
      serveRoot: '/assets',
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
      cache: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        User,
        Redacao,
        RedacaoComments,
        Correcao,
        CorrecaoComments,
        CorrecaoFeedback,
        CorrecaoHighlights,
        CorrecaoSuggestions,
        RefreshToken,
        RedacaoReport,
        CorrecaoReport,
      ],
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      connectTimeoutMS: 10000,
      poolSize: 10,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
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
    AdminModule,
    EmailsModule,
    TasksModule,
    RedacoesModule,
    CorrecoesModule,
    ReportsModule,
    TokenModule,
    DashboardModule,

    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
