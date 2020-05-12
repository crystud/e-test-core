import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Test } from '../tests/test.entity'
import { Group } from '../groups/group.entity'
import { Teacher } from '../teachers/teachers.entity'

@Entity('permissions')
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Test)
  @JoinColumn({ name: 'test_id' })
  test: Test

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group

  @Column({ type: 'datetime', name: 'start_time' })
  startTime: Date

  @Column({ type: 'datetime', name: 'end_time' })
  endTime: Date
}
