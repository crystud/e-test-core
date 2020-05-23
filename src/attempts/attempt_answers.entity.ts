import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Answer } from '../answers/answer.entity'
import { AttemptTask } from './attempt_task.entity'

@Entity('attempts_answers')
export class AttemptAnswer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => Answer,
    task => task.attemptAnswer,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'answer_id' })
  answer: Answer

  @ManyToOne(
    () => AttemptTask,
    attemptTask => attemptTask.attemptAnswers,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'attempt_task_id' })
  attemptTask: AttemptTask
}
