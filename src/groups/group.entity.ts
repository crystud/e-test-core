import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Expose, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Speciality } from '../specialties/speciality.entity'

@Entity('groups')
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  startEducation: Date

  @Column()
  endEducation: Date

  @Column({ default: true })
  active: boolean

  @Column({ type: 'smallint' })
  number: number

  @Transform(transformToId)
  @ManyToOne(
    () => Speciality,
    speciality => speciality.groups,
  )
  @JoinTable()
  speciality: Speciality

  @Transform(transformToId)
  @ManyToMany(
    () => User,
    user => user.groups,
  )
  students: User[]

  @Expose()
  get name(): string {
    return `${this.speciality.symbol}-${this.number}${this.number}`
  }
}
