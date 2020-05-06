import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Subject } from '../subject/subject.entity'

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
}
