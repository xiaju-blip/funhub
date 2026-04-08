import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('stake_pools')
export class StakePool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lockDays: number;

  @Column('decimal', { precision: 5, scale: 2 })
  baseApy: number;

  @Column('decimal', { precision: 20, scale: 8, nullable: true })
  maxStake: number;

  @Column('decimal', { precision: 20, scale: 8, default: 100 })
  minStake: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  penaltyRate: number;

  @Column({ default: 1 })
  status: number;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
