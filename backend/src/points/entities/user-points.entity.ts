import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_points')
export class UserPoints {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: 0 })
  totalEarned: number;

  @Column({ default: 0 })
  totalSpent: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
