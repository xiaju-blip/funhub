import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('stake_records')
export class StakeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  poolId: number;

  @Column('decimal', { precision: 20, scale: 8 })
  amount: number;

  @Column({ nullable: true })
  vipLevelAtStake: number;

  @Column({ nullable: true })
  lockEndTime: Date;

  @Column('decimal', { precision: 20, scale: 8, default: 0 })
  totalEarned: number;

  @Column('decimal', { precision: 20, scale: 8, default: 0 })
  pendingEarned: number;

  @Column({ default: 0 })
  autoCompound: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;
}
