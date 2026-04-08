import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('stake_earnings_periods')
export class StakeEarningsPeriods {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  stakeId: number;

  @Column()
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ nullable: true })
  appliedVipLevel: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  appliedApy: number;

  @Column('decimal', { precision: 20, scale: 8 })
  earnedAmount: number;

  @Column({ default: 0 })
  isSettled: number;

  @Column({ nullable: true })
  eventTrigger: string; // VIP_CHANGE / DEPOSIT / WITHDRAW

  @Column({ nullable: true })
  settledAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
