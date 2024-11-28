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
export class Redacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 200 })
  topic: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: ['rascunho', 'enviado'], default: 'rascunho' })
  statusEnvio: string;

  @Column({
    type: 'enum',
    enum: ['nao_corrigida', 'corrigida'],
    default: 'nao_corrigida',
  })
  statusCorrecao: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.redacoes, { onDelete: 'CASCADE' })
  user: User;
}
