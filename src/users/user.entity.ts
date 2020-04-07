import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Exclude, Transform } from 'class-transformer'
import { Token } from '../auth/token.entity'
import { College } from '../colleges/college.entity'
import { transformToId } from '../tools/transformers/transformToId'
import { Group } from '../groups/group.entity'
import { Subject } from '../subjects/subject.entity'
import { Study } from '../studies/study.entity'

export enum UserRolesType {
  ADMIN = 'admin',
  USER = 'user',
  GHOST = 'ghost',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  patronymic: string

  @Exclude()
  @Column()
  password: string

  @Column({
    unique: true,
  })
  email: string

  @Column({
    type: 'set',
    enum: UserRolesType,
    default: [UserRolesType.GHOST],
  })
  roles: UserRolesType[]

  @CreateDateColumn()
  createAt: Date

  @Exclude()
  @OneToOne(
    () => Token,
    token => token.user,
  )
  tokens: Token[]

  @Transform(transformToId)
  @ManyToMany(
    () => College,
    college => college.editors,
  )
  @JoinTable()
  editableColleges: College[]

  @Transform(transformToId)
  @ManyToMany(
    () => Group,
    group => group.students,
  )
  @JoinTable()
  groups: Group[]

  @Transform(transformToId)
  @OneToMany(
    () => College,
    college => college.creator,
  )
  ownColleges: College[]

  @Transform(transformToId)
  @OneToMany(
    () => Subject,
    subject => subject.creator,
  )
  createSubjectRequests: Subject[]

  @Transform(transformToId)
  @ManyToMany(
    () => Subject,
    subject => subject.teachers,
  )
  teachSubjects: Subject[]

  @Transform(transformToId)
  @ManyToMany(
    () => Subject,
    subject => subject.teachers,
  )
  studies: Study[]
}
