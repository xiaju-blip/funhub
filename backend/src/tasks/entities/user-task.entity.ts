import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_tasks')
export class UserTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  taskId: number;

  @Column({ default: 0 })
  progress: number;

  @Column({ nullable: true })
  target: number;

  @Column({ default: 0 })
  status: number; // 0:未开始 1:进行中 2:可领取 3:已完成 4:已过期

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  claimedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
