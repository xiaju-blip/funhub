import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('trade_history')
export class TradeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  makerId: number;

  @Column()
  takerId: number;

  @Column()
  type: number; // 1: maker buy 2: maker sell

  @Column('decimal', { precision: 20, scale: 8 })
  amount: number;

  @Column('decimal', { precision: 20, scale: 8 })
  price: number;

  @Column('decimal', { precision: 20, scale: 8 })
  fee: number;

  @CreateDateColumn()
  createdAt: Date;
}
