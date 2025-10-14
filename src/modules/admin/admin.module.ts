import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EmailsModule } from 'src/modules/emails/emails.module';
import { TokenModule } from 'src/modules/token/token.module';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { Redacao } from 'src/modules/redacoesModule/entities/redacao.entity';
import { RedacaoComments } from 'src/modules/redacoesModule/entities/redacaoComments.entity';
import { Correcao } from 'src/modules/correcoesModule/entities/correcao.entity';
import { RedacaoReport } from 'src/modules/reportsModule/entities/redacaoReport.entity';
import { CorrecaoReport } from 'src/modules/reportsModule/entities/correcaoReport.entity';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminReportsController } from './controllers/admin-reports.controller';
import { AdminRedacoesController } from './controllers/admin-redacoes.controller';
import { AdminCorrecoesController } from './controllers/admin-correcoes.controller';
import { AdminUserService } from './services/admin-user.service';
import { AdminAuthService } from './services/admin-auth.service';
import { AdminReportsService } from './services/admin-reports.service';
import { AdminRedacoesService } from './services/admin-redacoes.service';
import { AdminCorrecoesService } from './services/admin-correcoes.service';
import { AdminDeletionService } from './services/admin-deletion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Redacao,
      RedacaoComments,
      Correcao,
      RedacaoReport,
      CorrecaoReport,
    ]),
    AuthModule,
    EmailsModule,
    TokenModule,
    UsersModule,
  ],
  controllers: [
    AdminUserController,
    AdminAuthController,
    AdminReportsController,
    AdminRedacoesController,
    AdminCorrecoesController,
  ],
  providers: [
    AdminUserService,
    AdminAuthService,
    AdminReportsService,
    AdminRedacoesService,
    AdminCorrecoesService,
    AdminDeletionService,
  ],
  exports: [
    AdminUserService,
    AdminAuthService,
    AdminReportsService,
    AdminRedacoesService,
    AdminCorrecoesService,
    AdminDeletionService,
  ],
})
export class AdminModule {}
