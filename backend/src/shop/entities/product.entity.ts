import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('shop_products')
export class ShopProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: 0 })
  pointsRequired: number;

  @Column({ nullable: true })
  tokenRequired: number;

  @Column({ default: 9999 })
  stock: number;

  @Column({ default: 1 })
  status: number; // 1: active 0: inactive

  @Column({ nullable: true })
  category: string;

  @CreateDateColumn()
  createdAt: Date;
}
