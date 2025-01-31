import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCorrecoesController } from './Correcoes/controller/createCorrecoes.controller';
import { DeleteCorrecoesController } from './Correcoes/controller/deleteCorrecoes.controller';
import { GetCorrecoesController } from './Correcoes/controller/getRedacoes.controller';
import { CreateCorrecoesService } from './Correcoes/service/createCorrecoes.service';
import { DeleteCorrecoesService } from './Correcoes/service/deleteCorrecoes.service';
import { GetCorrecoesService } from './Correcoes/service/getRedacoes.service';
import { Correcao } from './entities/correcao.entity';

@Module({
  controllers: [
    CreateCorrecoesController,
    GetCorrecoesController,
    DeleteCorrecoesController,
  ],
  providers: [
    CreateCorrecoesService,
    GetCorrecoesService,
    DeleteCorrecoesService,
  ],
  imports: [TypeOrmModule.forFeature([Redacao, User, Correcao])],
})
export class CorrecoesModule {}
