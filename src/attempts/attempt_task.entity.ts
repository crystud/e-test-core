import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Task } from '../tasks/task.entity'
import { Attempt } from './attempt.entity'
import { AttemptAnswer } from './attempt_answers.entity'

@Entity('attempts_tasks')
export class AttemptTask extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => Task,
    task => task.attemptTasks,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'task_id' })
  task: Task

  @ManyToOne(
    () => Attempt,
    attempt => attempt.attemptTasks,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'attempt_id' })
  attempt: Attempt

  @OneToMany(
    () => AttemptAnswer,
    attemptAnswer => attemptAnswer.answer,
  )
  attemptAnswers: AttemptAnswer[]
}
