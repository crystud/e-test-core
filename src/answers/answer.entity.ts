import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Task } from '../tasks/task.entity'
import { Transform } from 'class-transformer'
import { AttemptAnswer } from '../attempts/attempt_answers.entity'

@Entity('answers')
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'answer_text', type: 'varchar', length: '128' })
  answerText: string

  @Column()
  correct: boolean

  @Column({ type: 'tinyint', nullable: true })
  position: number

  @Transform(image => {
    return image ? Buffer.from(image).toString() : null
  })
  @Column({ type: 'blob', nullable: true })
  image: string

  @ManyToOne(
    () => Task,
    task => task.answers,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'task_id' })
  task: Task

  @OneToMany(
    () => AttemptAnswer,
    attemptAnswer => attemptAnswer.answer,
  )
  attemptAnswer: AttemptAnswer[]
}
