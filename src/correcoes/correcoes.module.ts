import { Module } from '@nestjs/common';
import { CorrecoesController } from './controller/correcoes.controller';
import { CorrecoesService } from './service/correcoes.service';

@Module({
  controllers: [CorrecoesController],
  providers: [CorrecoesService],
})
export class CorrecoesModule {}
