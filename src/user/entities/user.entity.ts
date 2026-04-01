import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';
import { TimestampEntites } from '../../generics/timestamp.entities';
import { UserRoleEnum } from '../../enums/use-role.enum';

@Entity()
export class User extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role:UserRoleEnum;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Cv, (cv) => cv.user)
  cvs: Cv[];
}