import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  constructor(correcao?: Partial<Correcao>) {
    this.correcaoId = correcao?.correcaoId;
    this.user = correcao?.user;
    this.redacao = correcao?.redacao;
  }
}
