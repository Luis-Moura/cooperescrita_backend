import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { CorrecoesController } from './Correcoes/controller/createCorrecoes.controller';
import { CorrecoesService } from './Correcoes/service/createCorrecoes.service';
import { Correcao } from './entities/correcao.entity';

@Module({
  controllers: [CorrecoesController],
  providers: [CorrecoesService],
  imports: [TypeOrmModule.forFeature([Redacao, User, Correcao])],
})
export class CorrecoesModule {}
