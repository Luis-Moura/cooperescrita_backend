import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Correcao } from './correcao.entity';

@Entity()
export class CorrecaoHighlights {
  @PrimaryGeneratedColumn()
  correcaoHighlightId: number;

  @Column({ type: 'int' })
  startIndex: number;

  @Column({ type: 'int' })
  endIndex: number;

  @Column({ type: 'varchar', length: 10 })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Correcao, (correcao) => correcao.correcaoHighlights, {
    onDelete: 'CASCADE',
  })
  correcao: Correcao;
}
