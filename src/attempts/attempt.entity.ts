import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Ticket } from '../tickets/ticket.entity'
import { Expose } from 'class-transformer'
import { AttemptTask } from './attemptTask.entity'
import { Result } from '../results/result.entity'
import { ApiTags } from '@nestjs/swagger'

import { intervalToDuration } from 'date-fns'

@ApiTags('attempts')
@Entity('attempts')
export class Attempt extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'max_score', type: 'smallint', unsigned: true })
  maxScore: number

  @CreateDateColumn({ name: 'create_at' })
  startTime: Date

  @Column({ name: 'end_time', type: 'datetime', default: null })
  endTime: Date | null

  @Column({ name: 'max_end_time', type: 'datetime' })
  maxEndTime: Date

  @ManyToOne(
    () => Ticket,
    ticket => ticket.attempts,
  )
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket

  @OneToMany(
    () => AttemptTask,
    attemptTask => attemptTask.attempt,
  )
  attemptTasks: AttemptTask[]

  @OneToOne(
    () => Result,
    result => result.attempt,
  )
  result: Result | null

  @Expose({ name: 'active' })
  get _active(): boolean {
    return !Boolean(this.endTime)
  }

  @Expose({ name: 'timeSpent' })
  get _timeSpent(): Duration | null {
    if (this.startTime) return undefined

    if (this.endTime) {
      return intervalToDuration({
        start: this.startTime,
        end: this.endTime,
      })
    }

    return null
  }
}
