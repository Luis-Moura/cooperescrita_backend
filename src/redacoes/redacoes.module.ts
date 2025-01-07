import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateRedacaoController } from './controllers/createRedacao.controller';
import { DeleteRedacaoController } from './controllers/deleteRedacao.controller';
import { GetRedacaoController } from './controllers/getRedacao.controller';
import { Redacao } from './entities/redacao.entity';
import { CreateRedacaoService } from './services/createRedacao.service';
import { DeleteRedacaoService } from './services/deleteRedacao.service';
import { GetRedacaoService } from './services/getRedacao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Redacao, User])],
  controllers: [
    GetRedacaoController,
    CreateRedacaoController,
    DeleteRedacaoController,
  ],
  providers: [CreateRedacaoService, GetRedacaoService, DeleteRedacaoService],
})
export class RedacoesModule {}
