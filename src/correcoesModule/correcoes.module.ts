import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCorrecaoCommentsController } from './CorrecaoComments/controller/createCorrecaoComment.controller';
import { DeleteCorrecaoCommentController } from './CorrecaoComments/controller/deleteCorrecaoComment.controller';
import { GetCorrecaoCommentsController } from './CorrecaoComments/controller/getCorrecaoComment.controller';
import { CreateCorrecaoCommentsService } from './CorrecaoComments/service/createCorrecaoComment.service';
import { DeleteCorrecaoCommentService } from './CorrecaoComments/service/deleteCorrecaoComment.service';
import { GetCorrecaoCommentsService } from './CorrecaoComments/service/getCorrecaoComment.service';
import { CreateCorrecaoFeedbackController } from './CorrecaoFeedbacks/controller/createCorrecaoFeedback.controller';
import { GetCorrecaoFeedbackController } from './CorrecaoFeedbacks/controller/getCorrecaoFeedback.controller';
import { CreateCorrecaoFeedbackService } from './CorrecaoFeedbacks/service/createCorrecaoFeedback.service';
import { CreateCorrecaoHighlightsController } from './CorrecaoHighlights/controller/createCorrecaoHighlights.controller';
import { DeleteCorrecaoHighlightsController } from './CorrecaoHighlights/controller/deleteCorrecaoHighlight.controller';
import { GetCorrecaoHighlightsController } from './CorrecaoHighlights/controller/getCorrecaoHighlights.controller';
import { CreateCorrecaoHighlightsService } from './CorrecaoHighlights/service/createCorrecaoHighlights.service';
import { DeleteCorrecaoHighlightsService } from './CorrecaoHighlights/service/deleteCorrecaoHighlight.service';
import { GetCorrecaoHighlightsService } from './CorrecaoHighlights/service/getCorrecaoHighlights.service';
import { CreateCorrecaoSuggestionController } from './CorrecaoSuggestion/controller/createCorrecaoSuggestion.controller';
import { DeleteCorrecaoSuggestionController } from './CorrecaoSuggestion/controller/deleteCorrecaoSuggestion.controller';
import { GetCorrecaoSuggestionController } from './CorrecaoSuggestion/controller/getCorrecaosuggestion.controller';
import { CreateCorrecaoSuggestionService } from './CorrecaoSuggestion/service/createCorrecaoSuggestion.service';
import { DeleteCorrecaoSuggestionsService } from './CorrecaoSuggestion/service/deleteCorrecaoSuggestion.service';
import { GetCorrecaoSuggestionService } from './CorrecaoSuggestion/service/getCorrecaosuggestion.service';
import { CreateCorrecoesController } from './Correcoes/controller/createCorrecoes.controller';
import { DeleteCorrecoesController } from './Correcoes/controller/deleteCorrecoes.controller';
import { GetCorrecoesController } from './Correcoes/controller/getRedacoes.controller';
import { CreateCorrecoesService } from './Correcoes/service/createCorrecoes.service';
import { DeleteCorrecoesService } from './Correcoes/service/deleteCorrecoes.service';
import { GetCorrecoesService } from './Correcoes/service/getRedacoes.service';
import { Correcao } from './entities/correcao.entity';
import { CorrecaoComments } from './entities/correcaoComments.entity';
import { CorrecaoFeedback } from './entities/correcaoFeedback.entity';
import { CorrecaoHighlights } from './entities/correcaoHighlights.entity';
import { CorrecaoSuggestions } from './entities/correcaoSuggestions.entity';
import { GetCorrecaoFeedbackService } from './CorrecaoFeedbacks/service/getCorrecaoFeedback.service';

@Module({
  controllers: [
    CreateCorrecoesController,
    GetCorrecoesController,
    DeleteCorrecoesController,
    CreateCorrecaoCommentsController,
    GetCorrecaoCommentsController,
    DeleteCorrecaoCommentController,
    CreateCorrecaoHighlightsController,
    GetCorrecaoHighlightsController,
    DeleteCorrecaoHighlightsController,
    CreateCorrecaoSuggestionController,
    GetCorrecaoSuggestionController,
    DeleteCorrecaoSuggestionController,
    CreateCorrecaoFeedbackController,
    GetCorrecaoFeedbackController,
  ],
  providers: [
    CreateCorrecoesService,
    GetCorrecoesService,
    DeleteCorrecoesService,
    CreateCorrecaoCommentsService,
    GetCorrecaoCommentsService,
    DeleteCorrecaoCommentService,
    CreateCorrecaoHighlightsService,
    GetCorrecaoHighlightsService,
    DeleteCorrecaoHighlightsService,
    CreateCorrecaoSuggestionService,
    GetCorrecaoSuggestionService,
    DeleteCorrecaoSuggestionsService,
    CreateCorrecaoFeedbackService,
    GetCorrecaoFeedbackService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Redacao,
      User,
      Correcao,
      CorrecaoComments,
      CorrecaoHighlights,
      CorrecaoSuggestions,
      CorrecaoFeedback,
    ]),
  ],
})
export class CorrecoesModule {}
