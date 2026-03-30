import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';
import { TimestampEntites } from '../../generics/timestamp.entities';

@Entity()
export class Cv extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstname: string;

  @Column()
  age: number;

  @Column()
  cin: number;

  @Column()
  job: string;

  @Column()
  path: string;

  @ManyToOne(() => User, (user) => user.cvs, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Skill, (skill) => skill.cvs, { eager: true })
  @JoinTable()
  skills: Skill[];
}