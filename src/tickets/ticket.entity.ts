import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Student } from '../students/student.entity'
import { Permission } from '../permissions/permission.entity'
import { Attempt } from '../attempts/attempt.entity'
import { Expose } from 'class-transformer'
import { meanBy } from 'lodash'

import { isAfter, isBefore } from 'date-fns'

import { getLocalTime } from '../tools/dateUtils/getLocalTime'

@Entity('tickets')
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date

  @ManyToOne(
    () => Student,
    student => student.tickets,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'student_id' })
  student: Student

  @ManyToOne(
    () => Permission,
    permission => permission.tickets,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'permission_id' })
  permission: Permission

  @OneToMany(
    () => Attempt,
    attempt => attempt.ticket,
  )
  attempts: Attempt[]

  @Expose({ name: 'average' })
  get _average(): number | undefined {
    if (!this.attempts) return null

    return meanBy(
      this.attempts.filter(attempt => attempt.result?.percent),
      attempt => {
        return Number(attempt.result.percent)
      },
    )
  }

  @Expose({ name: 'used' })
  get _used(): boolean {
    if (!this.permission || !this.attempts) return undefined

    if (this.permission.maxCountOfUse === null) return false

    return this.attempts.length >= this.permission.maxCountOfUse
  }

  @Expose({ name: 'outstanding' })
  get _outstanding(): boolean {
    if (!this.permission) return undefined

    return isAfter(getLocalTime(), this.permission.endTime)
  }

  @Expose({ name: 'unstarted' })
  get _unstarted(): boolean {
    if (!this.permission) return undefined

    return isBefore(getLocalTime(), this.permission.startTime)
  }
}
