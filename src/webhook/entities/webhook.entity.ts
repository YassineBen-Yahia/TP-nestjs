import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { TimestampEntites } from '../../generics/timestamp.entities';

@Entity()
export class Webhook extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ type: 'simple-array' })
  events: string[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;
}
