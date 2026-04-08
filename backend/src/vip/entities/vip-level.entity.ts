import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('vip_levels')
export class VipLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  level: number; // 0, 1, 2, 3...

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 4 })
  stakeBonusPercent: number; // Extra APY bonus e.g. 0.05 = 5%

  @Column('decimal', { precision: 10, scale: 4 })
  poeBonusPercent: number; // Extra POE points bonus

  @Column('decimal', { precision: 20, scale: 8 })
  requiredToken: number; // Stake amount required to reach this level

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;
}
