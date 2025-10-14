import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Redacao } from 'src/modules/redacoesModule/entities/redacao.entity';
import { Correcao } from 'src/modules/correcoesModule/entities/correcao.entity';
import { RedacaoReport } from './entities/redacaoReport.entity';
import { CorrecaoReport } from './entities/correcaoReport.entity';
import { RedacaoReportsController } from './controllers/redacaoReports.controller';
import { CorrecaoReportsController } from './controllers/correcaoReports.controller';
import { RedacaoReportsService } from './services/redacaoReports.service';
import { CorrecaoReportsService } from './services/correcaoReports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Redacao,
      Correcao,
      RedacaoReport,
      CorrecaoReport,
    ]),
  ],
  controllers: [RedacaoReportsController, CorrecaoReportsController],
  providers: [RedacaoReportsService, CorrecaoReportsService],
  exports: [RedacaoReportsService, CorrecaoReportsService],
})
export class ReportsModule {}
