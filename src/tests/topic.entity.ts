import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { User } from '../users/user.entity'
import { Test } from './test.entity'
import { Subject } from '../subjects/subject.entity'

@Entity('topics')
export class Topic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ default: false })
  confirmed: boolean

  @Transform(transformToId)
  @ManyToOne(
    () => User,
    user => user.createTopicRequests,
    {
      nullable: false,
    },
  )
  creator: User

  @Transform(transformToId)
  @ManyToOne(
    () => Subject,
    subject => subject.topics,
    {
      nullable: false,
    },
  )
  subject: Subject

  @Transform(transformToId)
  @OneToMany(
    () => Test,
    test => test.topic,
  )
  tests: Test[]
}
