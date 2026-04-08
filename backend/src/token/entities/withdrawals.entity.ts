import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('withdrawals')
export class Withdrawals {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  fee: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  actualAmount: number;

  @Column({ nullable: true })
  txHash: string;

  @Column({ default: 0 })
  status: number; // 0:待处理 1:处理中 2:已完成 3:失败 4:风控拦截

  @Column()
  kycLevelSnapshot: number;

  @Column({ default: 0 })
  riskScore: number;

  @Column({ type: 'json', nullable: true })
  riskCheckResult: any;

  @Column({ nullable: true })
  auditUserId: number;

  @Column({ nullable: true })
  auditRemark: string;

  @Column({ nullable: true })
  rejectReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
