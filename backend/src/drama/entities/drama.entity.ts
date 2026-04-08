import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('dramas')
export class Drama {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  title: any; // {zh: '', en: ''}

  @Column('json', { nullable: true })
  description: any;

  @Column('json', { nullable: true })
  tags: any;

  @Column()
  coverImage: string;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ default: 0 })
  totalEpisodes: number;

  @Column({ default: 1 })
  status: number; // 1:上线 2:完结

  @Column({ default: 0 })
  vipLevel: number; // 0:免费 1:VIP1 2:VIP2 3:VIP3

  @Column({ nullable: true })
  releaseDate: Date;

  @Column({ nullable: true })
  releaseTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
