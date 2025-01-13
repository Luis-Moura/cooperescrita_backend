import { Redacao } from 'src/redacoes/entities/redacao.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informações Básicas do Usuário
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  // Status do Usuário
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  twoFA: boolean;

  // Controle de Segurança e Login
  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockUntil: Date | null;

  // Verificação e Data de Criação
  @Column({ type: 'varchar', length: 100, nullable: true })
  verificationCode: string;

  @Column({ type: 'timestamp', nullable: true })
  verificationCodeExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Redacao, (redacao) => redacao.user, { cascade: true })
  redacoes: Redacao[];

  constructor(user?: Partial<User>) {
    this.id = user?.id;
    this.name = user?.name;
    this.email = user?.email;
    this.password = user?.password;
    this.verified = user?.verified;
    this.role = user?.role;
    this.twoFA = user?.twoFA;
    this.failedLoginAttempts = user?.failedLoginAttempts;
    this.lockUntil = user?.lockUntil;
    this.verificationCode = user?.verificationCode;
    this.verificationCodeExpires = user?.verificationCodeExpires;
    this.createdAt = user?.createdAt;
    this.updatedAt = user?.updatedAt;
    this.redacoes = user?.redacoes;
  }
}
