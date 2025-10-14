import { Correcao } from 'src/modules/correcoesModule/entities/correcao.entity';
import { RedacaoComments } from '../../entities/redacaoComments.entity';

export interface RedacaoDTO {
  id: number;
  title: string;
  topic: string;
  content: string;
  statusEnvio: string;
  statusCorrecao: string;
  createdAt: Date;
  updatedAt: Date;
  correcoes: Correcao[];
  comentariosRedacao: RedacaoComments[];
  userName: string;
  userId: string;
}

export interface IGetRedacoes {
  redacoes: RedacaoDTO[];
  totalRedacoes: number;
}
