import { Module } from '@nestjs/common';
import { RedacoesService } from './redacoes.service';
import { RedacoesController } from './redacoes.controller';

@Module({
  controllers: [RedacoesController],
  providers: [RedacoesService],
})
export class RedacoesModule {}
