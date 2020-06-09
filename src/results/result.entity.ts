import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Attempt } from '../attempts/attempt.entity'
import { ResultTask } from './resultTask.entity'

@Entity('results')
export class Result extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'score', type: 'smallint', unsigned: true })
  score: number

  @Column({
    name: 'percent',
    type: 'decimal',
    unsigned: true,
  })
  percent: number

  @OneToOne(
    () => Attempt,
    attempt => attempt.result,
    { nullable: false },
  )
  @JoinColumn({ name: 'attempt_id' })
  attempt: Attempt

  @OneToMany(
    () => ResultTask,
    resultTask => resultTask.result,
  )
  resultTasks: ResultTask[]
}
