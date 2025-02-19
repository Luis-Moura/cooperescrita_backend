import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateRedacaoController } from './controllers/createRedacao.controller';
import { DeleteRedacaoController } from './controllers/deleteRedacao.controller';
import { GetRedacaoController } from './controllers/getRedacao.controller';
import { Redacao } from './entities/redacao.entity';
import { CreateRedacaoCommentController } from './redacaoComments/controller/createRedacaoComment.controller';
import { CreateRedacaoCommentService } from './redacaoComments/service/createRedacaoComment.service';
import { CreateRedacaoService } from './services/createRedacao.service';
import { DeleteRedacaoService } from './services/deleteRedacao.service';
import { GetRedacaoService } from './services/getRedacao.service';
import { RedacaoComments } from './entities/redacaoComments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Redacao, User, RedacaoComments])],
  controllers: [
    GetRedacaoController,
    CreateRedacaoController,
    DeleteRedacaoController,
    CreateRedacaoCommentController,
  ],
  providers: [
    CreateRedacaoService,
    GetRedacaoService,
    DeleteRedacaoService,
    CreateRedacaoCommentService,
  ],
})
export class RedacoesModule {}
