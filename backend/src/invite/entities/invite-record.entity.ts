import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('invite_records')
export class InviteRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  inviterId: number;

  @Column()
  inviteeId: number;

  @Column()
  level: number; // 1:直接 2:间接

  @Column()
  eventType: string; // register, kyc, first_invest, ad_watch

  @Column({ default: 0 })
  rewardPoints: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  rewardToken: number;

  @Column({ default: 0 })
  status: number; // 0:待发放 1:已发放 2:已冻结

  @CreateDateColumn()
  createdAt: Date;
}
