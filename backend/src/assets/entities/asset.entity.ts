import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  video: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  raisedAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  apy: number;

  @Column({ nullable: true })
  durationDays: number;

  @Column({ default: 0 })
  status: number; // 0:待发行 1:募资中 2:进行中 3:已结束

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
