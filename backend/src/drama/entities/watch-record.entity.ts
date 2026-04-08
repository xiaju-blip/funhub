import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('watch_records')
export class WatchRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  dramaId: number;

  @Column()
  episodeId: number;

  @Column()
  watchDuration: number;

  @Column({ default: 0 })
  isCompleted: number;

  @Column({ default: 0 })
  hasInteraction: number;

  @Column({ nullable: true })
  deviceFingerprint: string;

  @Column({ nullable: true })
  ipAddress: string;

  @UpdateDateColumn()
  lastWatchTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
