import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Correcao } from './correcao.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class CorrecaoFeedback {
  @PrimaryGeneratedColumn()
  correcaoFeedbackId: number;

  @Column({ type: 'enum', enum: ['like', 'dislike'] })
  feedbackType: 'like' | 'dislike';

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Correcao, (correcao) => correcao.correcaoFeedbacks, {
    onDelete: 'CASCADE',
  })
  correcao: Correcao;

  @ManyToOne(() => User, (user) => user.feedbacks, {
    onDelete: 'CASCADE',
  })
  user: User;
}
