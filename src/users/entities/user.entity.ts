import { Redacao } from 'src/redacoes/entities/redacao.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Alterado para string para UUID

  // Informações Básicas do Usuário
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // Status do Usuário
  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Column({ nullable: true, default: false })
  twoFA: boolean;

  // Controle de Segurança e Login
  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockUntil: Date | null;

  // Verificação e Data de Criação
  @Column({ nullable: true })
  verificationCode: string;

  @Column({ nullable: true })
  verificationCodeExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Redacao, (redacao) => redacao.user, { cascade: true })
  redacoes: Redacao[];
}
