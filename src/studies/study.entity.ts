import {
  BaseEntity,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Subject } from '../subjects/subject.entity'
import { College } from '../colleges/college.entity'
import { User } from '../users/user.entity'
import { Speciality } from '../specialties/speciality.entity'

@Entity('study')
@Index(['subject', 'college'], { unique: true })
export class Study extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToMany(
    () => User,
    user => user.studies,
  )
  @JoinTable()
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
}
