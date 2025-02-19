import { Redacao } from 'src/redacoesModule/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RedacaoComments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  startIndex: number;

  @Column({ type: 'int' })
  endIndex: number;

  @Column({ type: 'text' })
  comentario: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comentariosRedacao, {
    onDelete: 'CASCADE',
  })
  autor: User;

  @ManyToOne(() => Redacao, (redacao) => redacao.comentariosRedacao, {
    onDelete: 'CASCADE',
  })
  redacao: Redacao;

  constructor(comentario?: Partial<RedacaoComments>) {
    this.id = comentario?.id;
    this.startIndex = comentario?.startIndex;
    this.endIndex = comentario?.endIndex;
    this.comentario = comentario?.comentario;
    this.createdAt = comentario?.createdAt;
    this.updatedAt = comentario?.updatedAt;
    this.autor = comentario?.autor;
    this.redacao = comentario?.redacao;
  }
}
