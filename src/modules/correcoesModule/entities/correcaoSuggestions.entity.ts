import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Correcao } from './correcao.entity';

@Entity()
export class CorrecaoSuggestions {
  @PrimaryGeneratedColumn()
  correctionSuggestionId: number;

  @Column({ type: 'int' })
  startIndex: number;

  @Column({ type: 'int' })
  endIndex: number;

  @Column({ type: 'varchar' })
  originalText: string;

  @Column({ type: 'varchar' })
  suggestionText: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Correcao, (correction) => correction.correcaoSuggestions, {
    onDelete: 'CASCADE',
  })
  correcao: Correcao;
}
