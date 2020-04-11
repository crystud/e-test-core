import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Study } from '../studies/study.entity'
import { User } from '../users/user.entity'
import { Exclude, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Subject } from '../subjects/subject.entity'
import { College } from '../colleges/college.entity'

@Entity('tests')
export class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  isPublic: boolean

  @Exclude()
  @ManyToMany(
    () => Study,
    study => study.tests,
  )
  @JoinTable()
  studies: Study[]

  @Exclude()
  @ManyToOne(
    () => Subject,
    subject => subject.tests,
    {
      nullable: false,
    },
  )
  subject: Subject

  @Transform(transformToId)
  @ManyToOne(
    () => User,
    user => user.tests,
    {
      nullable: false,
    },
  )
  creator: User

  @Transform(transformToId)
  @ManyToMany(
    () => College,
    college => college.tests,
  )
  @JoinTable()
  colleges: College[]
}
