import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';
import { TimestampEntites } from '../../generics/timestamp.entities';


@Entity()
export class Skill extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  designation: string;

  @ManyToMany(() => Cv, (cv) => cv.skills)
  cvs: Cv[];
}