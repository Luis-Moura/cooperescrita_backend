import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCorrecoesController } from './Correcoes/controller/createCorrecoes.controller';
import { CreateCorrecoesService } from './Correcoes/service/createCorrecoes.service';
import { Correcao } from './entities/correcao.entity';

@Module({
  controllers: [CreateCorrecoesController],
  providers: [CreateCorrecoesService],
  imports: [TypeOrmModule.forFeature([Redacao, User, Correcao])],
})
export class CorrecoesModule {}
