import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Correcao } from './correcao.entity';

@Entity()
export class CorrecaoComments {
  @PrimaryGeneratedColumn()
  correcaoCommentId: number;

  @Column({ type: 'varchar', length: 500 })
  comment: string;

  @Column({ type: 'int' })
  startIndex: number;

  @Column({ type: 'int' })
  endIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Correcao, (correcao) => correcao.correcaoComments, {
    onDelete: 'CASCADE',
  })
  correcao: Correcao;
}
