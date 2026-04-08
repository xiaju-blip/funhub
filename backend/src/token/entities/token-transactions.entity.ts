import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('token_transactions')
export class TokenTransactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  type: number; // 1:积分兑换 2:VIP 购买 3:质押收益 4:提现 5:空投

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  balanceAfter: number;

  @Column({ default: 1 })
  status: number;

  @Column({ nullable: true })
  txHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
