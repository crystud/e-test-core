import { Expose } from 'class-transformer'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Speciality } from '../specialties/speciality.entity'
import moment from 'moment'
import { now } from 'moment'

import { Student } from '../students/student.entity'
import { Permission } from '../permissions/permission.entity'
import { Message } from '../messages/message.entity'

@Entity('groups')
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'start_year', type: 'year' })
  startYear: number

  @Column({ type: 'tinyint' })
  number: number

  @Column({ default: true })
  active: boolean

  @ManyToOne(
    () => Speciality,
    speciality => speciality.groups,
  )
  @JoinColumn({ name: 'speciality_id' })
  speciality: Speciality

  @OneToMany(
    () => Student,
    student => student.group,
  )
  students: Student[]

  @OneToMany(
    () => Permission,
    permission => permission.group,
  )
  permissions: Permission

  @ManyToMany(
    () => Message,
    messege => messege.groups,
  )
  messages: Message[]

  @Expose({ name: 'course' })
  get _course(): number {
    if (!this.startYear) return undefined

    return Math.abs(
      Math.round(
        moment(new Date(`01/09/${this.startYear}`)).diff(now(), 'years', true),
      ),
    )
  }

  @Expose({ name: 'name' })
  get _name(): string {
    if (!this.speciality?.symbol || !this.number) return undefined

    return `${this.speciality.symbol}-${this._course}${this.number}`
  }
}
