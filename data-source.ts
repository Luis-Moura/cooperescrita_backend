import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/users/entities/user.entity';
import { Redacao } from './src/redacoes/entities/redacao.entity';
import { Correcao } from 'src/correcoes/entities/correcao.entity';
import { CorrecaoComments } from 'src/correcoes/entities/correcaoComments.entity';
import { CorrecaoHighlights } from 'src/correcoes/entities/correcaoHighlights.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Redacao, Correcao, CorrecaoComments, CorrecaoHighlights],
  migrations: ['src/migrations/*.ts'],
});
