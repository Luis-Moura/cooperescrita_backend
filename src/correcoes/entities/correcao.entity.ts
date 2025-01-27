import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CorrecaoComments } from './correcaoComments.entity';
import { CorrecaoHighlights } from './correcaoHighlights.entity';

@Entity()
export class Correcao {
  @PrimaryGeneratedColumn()
  correcaoId: number;

  @ManyToOne(() => User, (user) => user.correcoes, { onDelete: 'CASCADE' })
  user: User;

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

  constructor(correcao?: Partial<Correcao>) {
    this.correcaoId = correcao?.correcaoId;
    this.user = correcao?.user;
    this.redacao = correcao?.redacao;
    this.correcaoComments = correcao?.correcaoComments;
  }
}
