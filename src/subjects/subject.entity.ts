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
import { College } from '../colleges/college.entity'
import { Exclude, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Study } from '../studies/study.entity'

@Entity('subjects')
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ default: false })
  confirmed: boolean

  @Transform(transformToId)
  @ManyToOne(
    () => User,
    user => user.createSubjectRequests,
    {
      nullable: false,
    },
  )
  creator: User

  @Transform(transformToId)
  @ManyToMany(
    () => User,
    user => user.teachSubjects,
  )
  teachers: User[]

  @Transform(transformToId)
  @ManyToMany(
    () => College,
    college => college.subjects,
  )
  @JoinTable()
  colleges: College[]

  @Transform(transformToId)
  @ManyToMany(
    () => College,
    college => college.subjects,
  )
  @JoinTable()
  tests: College[]

  @Exclude()
  @OneToMany(
    () => Study,
    study => study.subject,
  )
  studies: Study[]
}
