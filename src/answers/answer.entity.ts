import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Task } from '../tasks/task.entity'

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

  @ManyToOne(
    () => Task,
    task => task.answers,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'task_id' })
  task: Task
}
