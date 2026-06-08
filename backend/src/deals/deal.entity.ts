import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type DealType = 'group-buy' | 'delivery' | 'taxi-share' | 'carpool';

export type DealStatus = 'active' | 'completed' | 'expired';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: DealType;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: '' })
  imageUrl: string;

  @Column({ nullable: true })
  originalPrice: number;

  @Column({ nullable: true })
  groupPrice: number;

  @Column({ default: 0 })
  currentParticipants: number;

  @Column()
  targetParticipants: number;

  @Column()
  deadline: string;

  @Column()
  organizer: string;

  @Column({ default: '' })
  category: string;

  @Column({ default: 'active' })
  status: DealStatus;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  departureTime: string;

  @Column({ nullable: true })
  destination: string;

  @Column({ nullable: true })
  minOrderAmount: number;

  @Column({ nullable: true })
  externalLink: string;

  @CreateDateColumn()
  createdAt: Date;
}
