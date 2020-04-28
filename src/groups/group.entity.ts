import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Expose, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Speciality } from '../specialties/speciality.entity'
import * as moment from 'moment'
import { now } from 'moment'
import { Permission } from '../permissions/permission.entity'

@Entity('groups')
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'date' })
  startEducation: Date

  @Column({ type: 'date' })
  endEducation: Date

  @Column({ default: true })
  active: boolean

  @Column({ type: 'smallint' })
  number: number

  @Transform(transformToId)
  @ManyToOne(
    () => Speciality,
    speciality => speciality.groups,
    {
      nullable: false,
    },
  )
  @JoinTable()
  speciality: Speciality

  @Transform(transformToId)
  @ManyToMany(
    () => User,
    user => user.groups,
  )
  students: User[]

  @Transform(transformToId)
  @ManyToMany(
    () => Permission,
    permission => permission.groups,
  )
  permissions: Permission[]

  @Expose()
  get course(): number {
    return Math.abs(
      Math.round(moment(this.startEducation).diff(now(), 'years', true)),
    )
  }

  @Expose()
  get name(): string | null {
    return this.speciality
      ? `${this.speciality.symbol}-${this.course}${this.number}`
      : null
  }
}
