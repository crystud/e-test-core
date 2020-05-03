import {
  BaseEntity,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Subject } from '../subjects/subject.entity'
import { College } from '../colleges/college.entity'
import { User } from '../users/user.entity'
import { Speciality } from '../specialties/speciality.entity'
import { Expose } from 'class-transformer'

import { Test } from '../tests/test.entity'
import { Permission } from '../permissions/permission.entity'

@Entity('studies')
@Index(['subject', 'college'], { unique: true })
export class Study extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToMany(
    () => User,
    user => user.studies,
  )
  teachers: User[]

  @ManyToOne(
    () => Subject,
    subject => subject.studies,
  )
  subject: Subject

  @ManyToOne(
    () => College,
    college => college.studies,
  )
  college: College

  @ManyToMany(
    () => Speciality,
    speciality => speciality.studies,
  )
  @JoinTable()
  specialties: Speciality[]

  @ManyToMany(
    () => Test,
    test => test.studies,
  )
  tests: Test[]

  @OneToMany(
    () => Permission,
    permission => permission.study,
  )
  permissions: Permission[]

  @Expose({ name: 'subjectName' })
  get _subjectName(): string | null {
    return this.subject?.name ? this.subject.name : null
  }
}
