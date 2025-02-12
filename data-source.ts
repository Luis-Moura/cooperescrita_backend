import * as dotenv from 'dotenv';
// import { Correcao } from 'src/correcoes/entities/correcao.entity';
// import { CorrecaoComments } from 'src/correcoes/entities/correcaoComments.entity';
// import { CorrecaoFeedback } from 'src/correcoes/entities/correcaoFeedback.entity';
// import { CorrecaoHighlights } from 'src/correcoes/entities/correcaoHighlights.entity';
// import { CorrecaoSugestions } from 'src/correcoes/entities/correcaoSugestions.entity';
import { DataSource } from 'typeorm';
import { Correcao } from './src/correcoesModule/entities/correcao.entity';
import { CorrecaoComments } from './src/correcoesModule/entities/correcaoComments.entity';
import { CorrecaoFeedback } from './src/correcoesModule/entities/correcaoFeedback.entity';
import { CorrecaoHighlights } from './src/correcoesModule/entities/correcaoHighlights.entity';
import { CorrecaoSuggestions } from './src/correcoesModule/entities/correcaoSuggestions.entity';
import { Redacao } from './src/redacoes/entities/redacao.entity';
import { User } from './src/users/entities/user.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    User,
    Redacao,
    Correcao,
    CorrecaoComments,
    CorrecaoHighlights,
    CorrecaoSuggestions,
    CorrecaoFeedback,
  ],
  migrations: ['src/migrations/*.ts'],
});

// npm run migration:generate -- src/migrations/NomeDaMigration
