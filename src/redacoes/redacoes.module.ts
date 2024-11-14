import { Module } from '@nestjs/common';
import { RedacoesService } from './redacoes.service';
import { RedacoesController } from './redacoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redacao } from './entities/redacoe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Redacao])],
  controllers: [RedacoesController],
  providers: [RedacoesService],
})
export class RedacoesModule {}
