import { User } from 'src/users/entities/user.entity';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CorrecaoReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['conteudo_inadequado', 'spam', 'plagio', 'ofensivo', 'outro'],
  })
  motivo: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descricao?: string;

  @Column({
    type: 'enum',
    enum: ['pendente', 'analisado', 'rejeitado'],
    default: 'pendente',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  reportedBy: User;

  @ManyToOne(() => Correcao, { onDelete: 'CASCADE' })
  correcao: Correcao;

  constructor(report?: Partial<CorrecaoReport>) {
    this.id = report?.id;
    this.motivo = report?.motivo;
    this.descricao = report?.descricao;
    this.status = report?.status;
    this.createdAt = report?.createdAt;
    this.updatedAt = report?.updatedAt;
    this.reportedBy = report?.reportedBy;
    this.correcao = report?.correcao;
  }
}
