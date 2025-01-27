import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Correcao } from './correcao.entity';

@Entity()
export class CorrecaoSugestions {
  @PrimaryGeneratedColumn()
  correctionSugestionId: number;

  @Column({ type: 'int' })
  startIndex: number;

  @Column({ type: 'int' })
  endIndex: number;

  @Column({ type: 'varchar' })
  originalText: string;

  @Column({ type: 'varchar' })
  sugestionText: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Correcao, (correction) => correction.correcaoSugestions, {
    onDelete: 'CASCADE',
  })
  correcao: Correcao;
}
