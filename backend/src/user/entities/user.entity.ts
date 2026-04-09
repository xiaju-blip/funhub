import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true, length: 100 })
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ nullable: true, length: 100 })
  walletAddress: string;

  @Column({ nullable: true, length: 50 })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'smallint', default: 0 })
  emailVerified: number;

  @Column({ type: 'smallint', default: 0 })
  kycLevel: number;

  @Column({ type: 'smallint', default: 0 })
  vipLevel: number;

  @Column({ unique: true, length: 20 })
  inviteCode: string;

  @Column({ default: 0 })
  inviterId: number;

  @Column({ length: 10, default: 'en' })
  language: string;

  @Column({ length: 50, default: 'UTC' })
  timezone: string;

  @Column({ type: 'smallint', default: 1 })
  status: number;

  @Column({ type: 'smallint', default: 0 })
  isAdmin: number; // 0: 普通用户, 1: 管理员

  @CreateDateColumn()
  createdAt: Date;
}
