import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('trade_orders')
export class TradeOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  makerId: number;

  @Column()
  type: number; // 1: buy 2: sell

  @Column('decimal', { precision: 20, scale: 8 })
  amount: number;

  @Column('decimal', { precision: 20, scale: 8 })
  price: number;

  @Column('decimal', { precision: 20, scale: 8, default: 0 })
  filledAmount: number;

  @Column({ default: 1 })
  status: number; // 1: open 2: partially filled 3: filled 4: canceled

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
