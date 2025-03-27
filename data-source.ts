import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Correcao } from './src/correcoesModule/entities/correcao.entity';
import { CorrecaoComments } from './src/correcoesModule/entities/correcaoComments.entity';
import { CorrecaoFeedback } from './src/correcoesModule/entities/correcaoFeedback.entity';
import { CorrecaoHighlights } from './src/correcoesModule/entities/correcaoHighlights.entity';
import { CorrecaoSuggestions } from './src/correcoesModule/entities/correcaoSuggestions.entity';
import { Redacao } from './src/redacoesModule/entities/redacao.entity';
import { User } from './src/users/entities/user.entity';
import { RedacaoComments } from 'src/redacoesModule/entities/redacaoComments.entity';
import { RefreshToken } from 'src/token/entities/refreshToken.entity';

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
  ],
  migrations: ['src/migrations/*.ts'],
});

// npm run migration:generate -- src/migrations/NomeDaMigration
