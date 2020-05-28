import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from '../users/user.entity'
import { Group } from '../groups/group.entity'
import { Ticket } from '../tickets/ticket.entity'
import { Invite } from '../invites/invite.entity'

@Entity('students')
@Index(['user', 'group'], { unique: true })
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', name: 'scoring_book' })
  scoringBook: number

  @OneToMany(
    () => Ticket,
    ticket => ticket.student,
  )
  tickets: Ticket[]

  @ManyToOne(
    () => User,
    user => user.students,
  )
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(
    () => Group,
    group => group.students,
  )
  @JoinColumn({ name: 'group_id' })
  group: Group

  @OneToOne(
    () => Invite,
    invite => invite.student,
  )
  invite: Invite
}
