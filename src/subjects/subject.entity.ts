import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { College } from '../colleges/college.entity'
import { Speciality } from '../specialties/speciality.entity'
import { Exclude, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'

@Entity('subjects')
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ default: false })
  confirmed: string

  @Transform(transformToId)
  @ManyToMany(
    () => User,
    user => user.teachSubjects,
  )
  @JoinTable()
  teachers: User[]

  @Transform(transformToId)
  @ManyToMany(
    () => College,
    college => college.subjects,
  )
  @JoinTable()
  colleges: College[]

  @Exclude()
  @ManyToMany(
    () => Speciality,
    speciality => speciality.subjects,
  )
  @JoinTable()
  specialties: Speciality[]
}
