import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  AfterLoad,
} from 'typeorm'
import { Attempt } from '../attempts/attempt.entity'
import { ResultTask } from './resultTask.entity'
import { Expose } from 'class-transformer'

import { ResultInfoInterface } from './interfaces/resultInfo.interface'

@Entity('results')
export class Result extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'score', type: 'smallint', unsigned: true })
  score: number

  @Column({
    name: 'percent',
    type: 'numeric',
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

  @AfterLoad()
  afterLoad() {
    this.percent = Number(this.percent)
  }

  @Expose({ name: 'info' })
  get _info(): ResultInfoInterface | undefined {
    if (!this.resultTasks) return undefined

    const resultInfo: ResultInfoInterface = {
      correct: 0,
      incorrect: 0,
    }

    this.resultTasks.forEach(resultTask => {
      resultInfo.correct += resultTask.correct.length
      resultInfo.incorrect += resultTask.incorrect.length
    })

    return resultInfo
  }
}
