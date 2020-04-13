import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Exclude, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Speciality } from '../specialties/speciality.entity'
import { Subject } from '../subjects/subject.entity'
import { Study } from '../studies/study.entity'
import { Test } from '../tests/test.entity'

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
  editors: User[]

  @Exclude()
  @ManyToMany(
    () => Subject,
    subject => subject.colleges,
  )
  subjects: Subject[]

  @Transform(transformToId)
  @ManyToMany(
    () => Test,
    test => test.colleges,
  )
  tests: Test[]

  @Transform(transformToId)
  @OneToMany(
    () => Study,
    study => study.college,
  )
  studies: Study[]
}
