import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockUntil: Date | null;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true, default: false })
  twoFA: boolean;

  @Column({ nullable: true })
  verificationCode: string;

  @Column({ nullable: true })
  verificationCodeExpires: Date;
}
