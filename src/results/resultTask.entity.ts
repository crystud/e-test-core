import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Result } from './result.entity'
import { Task } from '../tasks/task.entity'

@Entity('result_tasks')
export class ResultTask extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'simple-array' })
  correct: string[]

  @Column({ type: 'simple-array' })
  incorrect: string[]

  @Column({ name: 'max_score', type: 'smallint', unsigned: true })
  maxScore: number

  @Column({ name: 'received_score', type: 'smallint', unsigned: true })
  receivedScore: number

  @ManyToOne(
    () => Task,
    task => task.taskResults,
    {
      nullable: false,
    },
  )
  task: Task

  @ManyToOne(
    () => Result,
    result => result.resultTasks,
  )
  @JoinColumn({ name: 'result_id' })
  result: Result
}
