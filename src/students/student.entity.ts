import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from '../users/user.entity'
import { Group } from '../groups/group.entity'

@Entity('students')
@Index(['user', 'group'], { unique: true })
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', name: 'scoring_book' })
  scoringBook: number

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
}
