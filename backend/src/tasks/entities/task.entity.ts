import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: number; // 1:新手 2:每日 3:每周 4:成就 5:限时

  @Column({ nullable: true })
  description: string;

  @Column()
  conditionType: string;

  @Column({ type: 'text', nullable: true })
  conditionValue: string;

  @Column()
  rewardPoints: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  rewardToken: number;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: 1 })
  status: number;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
