import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateRedacaoController } from './Redacoes/controllers/createRedacao.controller';
import { DeleteRedacaoController } from './Redacoes/controllers/deleteRedacao.controller';
import { GetRedacaoController } from './Redacoes/controllers/getRedacao.controller';
import { Redacao } from './entities/redacao.entity';
import { RedacaoComments } from './entities/redacaoComments.entity';
import { CreateRedacaoCommentController } from './redacaoComments/controller/createRedacaoComment.controller';
import { DeleteRedacaoCommentController } from './redacaoComments/controller/deleteRedacaoComment.controller';
import { GetRedacaoCommentsController } from './redacaoComments/controller/getRedacaoComment.controller';
import { UpdateRedacaoCommentController } from './redacaoComments/controller/updateRedacaoComment.controller';
import { CreateRedacaoCommentService } from './redacaoComments/service/createRedacaoComment.service';
import { DeleteRedacaoCommentService } from './redacaoComments/service/deleteRedacaoComment.service';
import { GetRedacaoCommentService } from './redacaoComments/service/getRedacaoComment.service';
import { UpdateRedacaoCommentService } from './redacaoComments/service/updateRedacaoComment.service';
import { CreateRedacaoService } from './Redacoes/services/createRedacao.service';
import { DeleteRedacaoService } from './Redacoes/services/deleteRedacao.service';
import { GetRedacaoService } from './Redacoes/services/getRedacao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Redacao, User, RedacaoComments])],
  controllers: [
    GetRedacaoController,
    CreateRedacaoController,
    DeleteRedacaoController,
    CreateRedacaoCommentController,
    GetRedacaoCommentsController,
    DeleteRedacaoCommentController,
    UpdateRedacaoCommentController,
  ],
  providers: [
    CreateRedacaoService,
    GetRedacaoService,
    DeleteRedacaoService,
    CreateRedacaoCommentService,
    GetRedacaoCommentService,
    DeleteRedacaoCommentService,
    UpdateRedacaoCommentService,
  ],
})
export class RedacoesModule {}
