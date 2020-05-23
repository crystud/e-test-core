import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Topic } from '../topics/topic.entity'

import { Transform } from 'class-transformer'
import { TaskType } from './enums/TaskType.enum'
import { Answer } from '../answers/answer.entity'
import { Test } from '../tests/test.entity'
import { User } from '../users/user.entity'
import { AttemptTask } from '../attempts/attemptTask.entity'

@Entity('tasks')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  question: string

  @Transform(image => {
    return image ? Buffer.from(image).toString() : null
  })
  @Column({ type: 'blob', nullable: true })
  image: string

  @Transform(type => TaskType[type])
  @Column({ type: 'smallint' })
  type: TaskType

  @Column({ type: 'mediumtext', nullable: true })
  attachment: string

  @ManyToOne(
    () => Topic,
    topic => topic.tasks,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'topic_id' })
  topic: Topic

  @ManyToOne(
    () => User,
    user => user.tasks,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'user_id' })
  creator: User

  @OneToMany(
    () => Answer,
    answer => answer.task,
  )
  answers: Answer[]

  @ManyToMany(
    () => Test,
    test => test.tasks,
  )
  tests: Test[]

  @OneToMany(
    () => AttemptTask,
    attemptTask => attemptTask.task,
  )
  attemptTasks: AttemptTask
}
