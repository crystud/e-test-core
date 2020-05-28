import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Test } from '../tests/test.entity'
import { Group } from '../groups/group.entity'

import { Ticket } from '../tickets/ticket.entity'

import { Teacher } from '../teachers/teachers.entity'

@Entity('permissions')
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Test)
  @JoinColumn({ name: 'test_id' })
  test: Test

  @ManyToOne(
    () => Teacher,
    teacher => teacher.permissions,
  )
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher

  @ManyToOne(
    () => Group,
    group => group.permissions,
  )
  @JoinColumn({ name: 'group_id' })
  group: Group

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date

  @Column({
    type: 'datetime',
    name: 'start_time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startTime: Date

  @Column({ type: 'datetime', name: 'end_time', nullable: true })
  endTime: Date

  @Column({ name: 'max_count_of_use', type: 'tinyint', nullable: true })
  maxCountOfUse: number

  @OneToMany(
    () => Ticket,
    ticket => ticket.permission,
  )
  tickets: Ticket[]
}
