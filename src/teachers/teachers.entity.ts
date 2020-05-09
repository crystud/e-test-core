import {
  BaseEntity,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'

import { Subject } from '../subject/subject.entity'
import { Test } from '../tests/test.entity'
import { Task } from '../tasks/task.entity'

@Entity('teachers')
@Index(['user', 'subject'], { unique: true })
export class Teacher extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => User,
    user => user.teachers,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(
    () => Subject,
    group => group.teachers,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'subject_id' })
  subject: Subject

  @OneToMany(
    () => Test,
    test => test.creator,
  )
  tests: Test[]

  @OneToMany(
    () => Task,
    task => task.creator,
  )
  tasks: Test[]
}
