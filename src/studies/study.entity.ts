import {
  BaseEntity,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Subject } from '../subjects/subject.entity'
import { College } from '../colleges/college.entity'
import { User } from '../users/user.entity'
import { Speciality } from '../specialties/speciality.entity'
import { Expose, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Test } from '../tests/test.entity'

@Entity('studies')
// @Index(['subject', 'college'], { unique: true })
export class Study extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Transform(transformToId)
  @ManyToMany(
    () => User,
    user => user.studies,
  )
  teachers: User[]

  @Transform(transformToId)
  @ManyToOne(
    () => Subject,
    subject => subject.studies,
  )
  subject: Subject

  @Transform(transformToId)
  @ManyToOne(
    () => College,
    college => college.studies,
  )
  college: College

  @Transform(transformToId)
  @ManyToMany(
    () => Speciality,
    speciality => speciality.studies,
  )
  @JoinTable()
  specialties: Speciality[]

  @Transform(transformToId)
  @ManyToMany(
    () => Test,
    test => test.studies,
  )
  tests: Test[]

  @Expose()
  get subjectName(): string {
    return this.subject.name
  }
}
