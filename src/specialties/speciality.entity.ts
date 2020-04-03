import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { College } from '../colleges/college.entity'
import { Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Group } from '../groups/group.entity'
import { Subject } from '../subjects/subject.entity'

export enum SubjectStudyType {
  DAILY = 'daily',
  EXTERNAL = 'external',
}

@Entity('specialties')
export class Speciality extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'varchar', length: 8 })
  symbol: string

  @Column({ type: 'smallint' })
  yearOfStudy: number

  @Column({ unique: true })
  code: number

  @Transform(transformToId)
  @ManyToOne(
    () => College,
    college => college.specialties,
  )
  college: College

  @Transform(transformToId)
  @OneToMany(
    () => Group,
    group => group.speciality,
  )
  groups: Group[]

  @Column({
    type: 'set',
    enum: SubjectStudyType,
    default: [SubjectStudyType.DAILY, SubjectStudyType.EXTERNAL],
  })
  roles: SubjectStudyType[]

  @Transform(transformToId)
  @ManyToMany(
    () => Subject,
    subject => subject.specialties,
  )
  subjects: Subject[]
}
