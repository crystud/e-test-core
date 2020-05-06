import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Topic } from '../topics/topic.entity'
import { Teacher } from '../teachers/teachers.entity'

@Entity('subject')
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
}
