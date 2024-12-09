import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/users/entities/user.entity';
import { Redacao } from './src/redacoes/entities/redacao.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Redacao],
  migrations: ['src/migrations/*.ts'],
});
