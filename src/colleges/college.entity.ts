import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Speciality } from '../specialties/speciality.entity'
import { Subject } from '../subjects/subject.entity'

@Entity('colleges')
export class College extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column()
  address: string

  @Column({ default: false })
  confirmed: boolean

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  site: string

  @Column({ nullable: true })
  EDBO?: number

  @Transform(transformToId)
  @ManyToOne(
    () => User,
    user => user.ownColleges,
    {
      nullable: false,
    },
  )
  creator: User

  @Transform(transformToId)
  @OneToMany(
    () => Speciality,
    speciality => speciality.college,
  )
  specialties: Speciality[]

  @Transform(transformToId)
  @ManyToMany(
    () => User,
    user => user.editableColleges,
  )
  @JoinTable()
  editors: User[]

  @Transform(transformToId)
  @ManyToMany(
    () => Subject,
    subject => subject.colleges,
  )
  subjects: Subject[]
}
