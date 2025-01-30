import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { CorrecoesController } from './controller/correcoes.controller';
import { CorrecoesService } from './service/correcoes.service';
import { Correcao } from './entities/correcao.entity';

@Module({
  controllers: [CorrecoesController],
  providers: [CorrecoesService],
  imports: [TypeOrmModule.forFeature([Redacao, User, Correcao])],
})
export class CorrecoesModule {}
