import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('shop_orders')
export class ShopOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  pointsPaid: number;

  @Column({ default: 0 })
  tokenPaid: number;

  @Column({ default: 1 })
  status: number; // 1: pending 2: processed 3: shipped 4: completed 5: canceled

  @Column({ nullable: true })
  shippingAddress: string;

  @Column({ nullable: true })
  contactPhone: string;

  @CreateDateColumn()
  createdAt: Date;
}
