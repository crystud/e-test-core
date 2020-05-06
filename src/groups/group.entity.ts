import { Expose } from 'class-transformer'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Speciality } from '../specialties/speciality.entity'
import * as moment from 'moment'
import { now } from 'moment'

import { Student } from '../students/student.entity'

@Entity('groups')
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'start_year', type: 'smallint' })
  startYear: number

  @Expose()
  @Column({ type: 'tinyint' })
  number: number

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

  @Expose({ name: 'course' })
  get _course(): number {
    return Math.abs(
      Math.round(
        moment(new Date(`01/09/${this.startYear}`)).diff(now(), 'years', true),
      ),
    )
  }

  @Expose({ name: 'name' })
  get _name(): string {
    return `${this.speciality.symbol}-${this._course}${this.number}`
  }
}
