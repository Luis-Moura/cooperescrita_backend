import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CorrecaoComments } from './correcaoComments.entity';
import { CorrecaoFeedback } from './correcaoFeedback.entity';
import { CorrecaoHighlights } from './correcaoHighlights.entity';
import { CorrecaoSugestions } from './correcaoSugestions.entity';

@Entity()
export class Correcao {
  @PrimaryGeneratedColumn()
  correcaoId: number;

  @Column({ type: 'enum', enum: ['rascunho', 'enviado'], default: 'rascunho' })
  statusEnvio: string;

  @ManyToOne(() => User, (user) => user.correcoes, { onDelete: 'CASCADE' })
  corretor: User;

  @ManyToOne(() => Redacao, (redacao) => redacao.correcoes, {
    onDelete: 'CASCADE',
  })
  redacao: Redacao;

  @OneToMany(
    () => CorrecaoComments,
    (correcaoComments) => correcaoComments.correcao,
    { onDelete: 'CASCADE' },
  )
  correcaoComments: CorrecaoComments[];

  @OneToMany(
    () => CorrecaoHighlights,
    (correcaoHighlights) => correcaoHighlights.correcao,
    { onDelete: 'CASCADE' },
  )
  correcaoHighlights: CorrecaoHighlights[];

  @OneToMany(
    () => CorrecaoSugestions,
    (correcaoSugestions) => correcaoSugestions.correcao,
    { onDelete: 'CASCADE' },
  )
  correcaoSugestions: CorrecaoSugestions[];

  @OneToMany(
    () => CorrecaoFeedback,
    (correcaoFeedback) => correcaoFeedback.correcao,
    { onDelete: 'CASCADE' },
  )
  correcaoFeedbacks: CorrecaoFeedback[];

  @CreateDateColumn()
  createdAt: Date;

  constructor(correcao?: Partial<Correcao>) {
    this.correcaoId = correcao?.correcaoId;
    this.statusEnvio = correcao?.statusEnvio;
    this.corretor = correcao?.corretor;
    this.redacao = correcao?.redacao;
    this.correcaoComments = correcao?.correcaoComments;
    this.correcaoHighlights = correcao?.correcaoHighlights;
    this.correcaoSugestions = correcao?.correcaoSugestions;
    this.correcaoFeedbacks = correcao?.correcaoFeedbacks;
  }
}
