import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Correcao } from './src/modules/correcoesModule/entities/correcao.entity';
import { CorrecaoComments } from './src/modules/correcoesModule/entities/correcaoComments.entity';
import { CorrecaoFeedback } from './src/modules/correcoesModule/entities/correcaoFeedback.entity';
import { CorrecaoHighlights } from './src/modules/correcoesModule/entities/correcaoHighlights.entity';
import { CorrecaoSuggestions } from './src/modules/correcoesModule/entities/correcaoSuggestions.entity';
import { Redacao } from './src/modules/redacoesModule/entities/redacao.entity';
import { User } from './src/modules/users/entities/user.entity';
import { RedacaoComments } from 'src/modules/redacoesModule/entities/redacaoComments.entity';
import { RefreshToken } from 'src/modules/token/entities/refreshToken.entity';
import { RedacaoReport } from './src/modules/reportsModule/entities/redacaoReport.entity';
import { CorrecaoReport } from './src/modules/reportsModule/entities/correcaoReport.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    User,
    Redacao,
    RedacaoComments,
    Correcao,
    CorrecaoComments,
    CorrecaoHighlights,
    CorrecaoSuggestions,
    CorrecaoFeedback,
    RefreshToken,
    RedacaoReport,
    CorrecaoReport,
  ],
  migrations: ['src/migrations/*.ts'],
});

// npm run migration:generate -- src/migrations/NomeDaMigration
