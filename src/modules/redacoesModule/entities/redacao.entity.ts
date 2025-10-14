import { Correcao } from 'src/modules/correcoesModule/entities/correcao.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RedacaoComments } from './redacaoComments.entity';

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

  @OneToMany(() => Correcao, (correcao) => correcao.redacao, {
    onDelete: 'CASCADE',
  })
  correcoes: Correcao[];

  @OneToMany(() => RedacaoComments, (comentario) => comentario.redacao, {
    onDelete: 'CASCADE',
  })
  comentariosRedacao: RedacaoComments[];

  constructor(redacao?: Partial<Redacao>) {
    this.id = redacao?.id;
    this.title = redacao?.title;
    this.topic = redacao?.topic;
    this.content = redacao?.content;
    this.statusEnvio = redacao?.statusEnvio;
    this.statusCorrecao = redacao?.statusCorrecao;
    this.createdAt = redacao?.createdAt;
    this.updatedAt = redacao?.updatedAt;
    this.user = redacao?.user;
    this.correcoes = redacao?.correcoes;
    this.comentariosRedacao = redacao?.comentariosRedacao;
  }
}
