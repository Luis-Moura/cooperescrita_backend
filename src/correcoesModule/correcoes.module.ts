import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCorrecaoCommentsController } from './CorrecaoComments/controller/createCorrecaoComment.controller';
import { GetCorrecaoCommentsController } from './CorrecaoComments/controller/getCorrecaoComment.controller';
import { CreateCorrecaoCommentsService } from './CorrecaoComments/service/createCorrecaoComment.service';
import { GetCorrecaoCommentsService } from './CorrecaoComments/service/getCorrecaoComment.service';
import { CreateCorrecoesController } from './Correcoes/controller/createCorrecoes.controller';
import { DeleteCorrecoesController } from './Correcoes/controller/deleteCorrecoes.controller';
import { GetCorrecoesController } from './Correcoes/controller/getRedacoes.controller';
import { CreateCorrecoesService } from './Correcoes/service/createCorrecoes.service';
import { DeleteCorrecoesService } from './Correcoes/service/deleteCorrecoes.service';
import { GetCorrecoesService } from './Correcoes/service/getRedacoes.service';
import { Correcao } from './entities/correcao.entity';
import { CorrecaoComments } from './entities/correcaoComments.entity';
import { DeleteCorrecaoCommentController } from './CorrecaoComments/controller/deleteCorrecaoComment.controller';
import { DeleteCorrecaoCommentService } from './CorrecaoComments/service/deleteCorrecaoComment.service';
import { CreateCorrecaoHighlightsController } from './CorrecaoHighlights/controller/createCorrecaoHighlights.controller';
import { CreateCorrecaoHighlightsService } from './CorrecaoHighlights/service/createCorrecaoHighlights.service';
import { CorrecaoHighlights } from './entities/correcaoHighlights.entity';

@Module({
  controllers: [
    CreateCorrecoesController,
    GetCorrecoesController,
    DeleteCorrecoesController,
    CreateCorrecaoCommentsController,
    GetCorrecaoCommentsController,
    DeleteCorrecaoCommentController,
    CreateCorrecaoHighlightsController,
  ],
  providers: [
    CreateCorrecoesService,
    GetCorrecoesService,
    DeleteCorrecoesService,
    CreateCorrecaoCommentsService,
    GetCorrecaoCommentsService,
    DeleteCorrecaoCommentService,
    CreateCorrecaoHighlightsService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Redacao,
      User,
      Correcao,
      CorrecaoComments,
      CorrecaoHighlights,
    ]),
  ],
})
export class CorrecoesModule {}
