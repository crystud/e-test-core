import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Ticket } from '../tickets/ticket.entity'
import { Expose } from 'class-transformer'

@Entity('attempts')
export class Attempt extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'max_score', type: 'smallint', unsigned: true })
  maxScore: number

  @CreateDateColumn({ name: 'create_at' })
  startTime: Date

  @Column({ name: 'end_time', type: 'datetime' })
  endTime: Date | null

  @Column({ name: 'max_end_time', type: 'datetime' })
  maxEndTime: Date

  @ManyToOne(
    () => Ticket,
    ticket => ticket.attempts,
  )
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket

  @Expose({ name: 'active' })
  get _active(): boolean {
    return Boolean(this.endTime)
  }
}
