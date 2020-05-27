import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Topic } from '../topics/topic.entity'
import { Teacher } from '../teachers/teachers.entity'
import { Speciality } from '../specialties/speciality.entity'
import { Test } from '../tests/test.entity'

@Entity('subjects')
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: '50', unique: true })
  name: string

  @OneToMany(
    () => Teacher,
    teacher => teacher.subject,
  )
  teachers: Teacher[]

  @OneToMany(
    () => Topic,
    topic => topic.subject,
  )
  topics: Topic[]

  @OneToMany(
    () => Test,
    test => test.subject,
  )
  tests: Test[]

  @ManyToMany(
    () => Speciality,
    speciality => speciality.subjects,
  )
  @JoinTable({
    name: 'subjects_specialties',
    joinColumn: {
      name: 'subject_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'speciality_id',
      referencedColumnName: 'id',
    },
  })
  specialties: Speciality[]
}
