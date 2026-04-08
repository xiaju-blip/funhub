import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('drama_episodes')
export class DramaEpisode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dramaId: number;

  @Column()
  episodeNum: number;

  @Column('json')
  title: any; // {zh: '', en: ''}

  @Column()
  videoUrlEncrypted: string;

  @Column({ nullable: true })
  drmKeyId: string;

  @Column('json', { nullable: true })
  subtitles: any; // { "zh-CN": "url" }

  @Column('json', { nullable: true })
  adBreakPoints: any; // [{time: 30, placementId: 1}]

  @Column()
  duration: number;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
