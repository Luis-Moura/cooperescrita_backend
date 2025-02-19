import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateRedacaoController } from './controllers/createRedacao.controller';
import { DeleteRedacaoController } from './controllers/deleteRedacao.controller';
import { GetRedacaoController } from './controllers/getRedacao.controller';
import { Redacao } from './entities/redacao.entity';
import { RedacaoComments } from './entities/redacaoComments.entity';
import { CreateRedacaoCommentController } from './redacaoComments/controller/createRedacaoComment.controller';
import { GetRedacaoCommentsController } from './redacaoComments/controller/getRedacaoComment.controller';
import { CreateRedacaoCommentService } from './redacaoComments/service/createRedacaoComment.service';
import { GetRedacaoCommentService } from './redacaoComments/service/getRedacaoComment.service';
import { CreateRedacaoService } from './services/createRedacao.service';
import { DeleteRedacaoService } from './services/deleteRedacao.service';
import { GetRedacaoService } from './services/getRedacao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Redacao, User, RedacaoComments])],
  controllers: [
    GetRedacaoController,
    CreateRedacaoController,
    DeleteRedacaoController,
    CreateRedacaoCommentController,
    GetRedacaoCommentsController,
  ],
  providers: [
    CreateRedacaoService,
    GetRedacaoService,
    DeleteRedacaoService,
    CreateRedacaoCommentService,
    GetRedacaoCommentService,
  ],
})
export class RedacoesModule {}
