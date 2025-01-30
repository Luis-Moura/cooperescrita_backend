import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCorrecoesController } from './Correcoes/controller/createCorrecoes.controller';
import { GetCorrecoesController } from './Correcoes/controller/getRedacoes.controller';
import { CreateCorrecoesService } from './Correcoes/service/createCorrecoes.service';
import { GetCorrecoesService } from './Correcoes/service/getRedacoes.service';
import { Correcao } from './entities/correcao.entity';

@Module({
  controllers: [CreateCorrecoesController, GetCorrecoesController],
  providers: [CreateCorrecoesService, GetCorrecoesService],
  imports: [TypeOrmModule.forFeature([Redacao, User, Correcao])],
})
export class CorrecoesModule {}
