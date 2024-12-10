import { Redacao } from '../entities/redacao.entity';

export interface IGetRedacoes {
  redacoes: Redacao[];
  totalRedacoes: number;
}
