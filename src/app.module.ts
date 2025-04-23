import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
import { Redacao } from './redacoesModule/entities/redacao.entity';
import { RedacaoComments } from './redacoesModule/entities/redacaoComments.entity';
import { RedacoesModule } from './redacoesModule/redacoes.module';
import { TasksModule } from './tasks/tasks.module';
import { RefreshToken } from './token/entities/refreshToken.entity';
import { TokenModule } from './token/token.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

dotenv.config();

const redisUrl = new URL(process.env.REDIS_URL || '');

@Module({
  imports: [
    // 📂 Servir arquivos estáticos
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
      serveRoot: '/assets',
    }),

    // 🔧 Configurações
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
      cache: true,
    }),

    // 🔧 Banco de dados
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
      ],
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false } // mudar isso, tem que gerar um certificado ssl
          : false,
      connectTimeoutMS: 10000, // Timeout para evitar ataques DoS
      poolSize: 10, // Controle de pool de conexões
      // logging: process.env.NODE_ENV === 'development',
    }),

    // ⚡ Controle de taxa de requisições (Throttling)
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),

    // 🔗 Integração com Redis
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

    // 🧩 Módulos internos da aplicação
    UsersModule,
    AuthModule,
    EmailsModule,
    TasksModule,
    RedacoesModule,
    CorrecoesModule,
    TokenModule,

    // 🕒 Agendamentos (Scheduler)
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    // 🛠 Serviço de tarefas
    // TasksService,

    // 🚦 Guard de limitação de requisições
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
