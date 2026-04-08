import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_tokens')
export class UserTokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  locked: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalEarned: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalSpent: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
