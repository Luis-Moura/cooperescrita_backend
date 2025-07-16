import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { Redacao } from 'src/redacoesModule/entities/redacao.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DASHBOARD_USECASE } from './useCase/DashboardUseCase';

@Module({
  imports: [TypeOrmModule.forFeature([Redacao, Correcao])],
  controllers: [DashboardController],
  providers: [
    {
      provide: DASHBOARD_USECASE,
      useClass: DashboardService,
    },
  ],
})
export class DashboardModule {}
