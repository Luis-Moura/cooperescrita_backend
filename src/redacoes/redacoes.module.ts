import { Module } from '@nestjs/common';
import { RedacoesService } from './redacoes.service';
import { RedacoesController } from './redacoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redacao } from './entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Redacao, User])],
  controllers: [RedacoesController],
  providers: [RedacoesService],
})
export class RedacoesModule {}
