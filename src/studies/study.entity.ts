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
import { Expose, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'

@Entity('study')
@Index(['subject', 'college'], { unique: true })
export class Study extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Transform(transformToId)
  @ManyToMany(
    () => User,
    user => user.studies,
  )
  @JoinTable()
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

  @Expose()
  get subjectName(): string {
    return this.subject.name
  }
}
