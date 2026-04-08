import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('points_transactions')
export class PointsTransactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  type: number; // 1:观看视频 2:签到 3:广告 4:兑换 5:补签 6:任务奖励 7:活动奖励

  @Column()
  amount: number;

  @Column()
  balanceAfter: number;

  @Column({ nullable: true })
  sourceId: string;

  @CreateDateColumn()
  createdAt: Date;
}
