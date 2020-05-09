import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Subject } from '../subject/subject.entity'
import { Task } from '../tasks/task.entity'

@Entity('topics')
export class Topic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: '50' })
  name: string

  @ManyToOne(
    () => Subject,
    subject => subject.topics,
  )
  @JoinColumn({ name: 'subject_id' })
  subject: Subject

  @OneToMany(
    () => Task,
    task => task.topic,
  )
  tasks: Task[]
}
