import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose, Transform } from 'class-transformer'
import { Token } from '../auth/token.entity'
import { College } from '../colleges/college.entity'
import { transformToId } from '../tools/transformers/transformToId'
import { Group } from '../groups/group.entity'
import { Subject } from '../subjects/subject.entity'
import { Study } from '../studies/study.entity'
import { Test } from '../tests/test.entity'
import { Topic } from '../tests/topic.entity'
import { UserRolesType } from '../enums/userRolesType'
import { AccessLevelType } from '../enums/accessLevelType'

@Exclude()
@Entity('users')
export class User extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @Column()
  firstName: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @Column()
  lastName: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @Column()
  patronymic: string

  @Column()
  password: string

  @Expose({ groups: [UserRolesType.ADMIN, AccessLevelType.TOKEN] })
  @Column({
    unique: true,
  })
  email: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @Column({
    type: 'set',
    enum: UserRolesType,
    default: [UserRolesType.GHOST],
  })
  roles: UserRolesType[]

  @Expose({ groups: [UserRolesType.ADMIN, AccessLevelType.TOKEN] })
  @CreateDateColumn()
  createAt: Date

  @OneToMany(
    () => Token,
    token => token.user,
  )
  tokens: Token[]

  @Transform(transformToId)
  @Expose({ groups: [UserRolesType.USER] })
  @ManyToMany(
    () => College,
    college => college.editors,
  )
  @JoinTable()
  editableColleges: College[]

  @Transform(transformToId)
  @Expose({ groups: [UserRolesType.USER] })
  @ManyToMany(
    () => Group,
    group => group.students,
  )
  @JoinTable()
  groups: Group[]

  @Transform(transformToId)
  @Expose({ groups: [UserRolesType.USER] })
  @OneToMany(
    () => College,
    college => college.creator,
  )
  ownColleges: College[]

  @Transform(transformToId)
  @Expose({ groups: [UserRolesType.USER, AccessLevelType.OWN] })
  @OneToMany(
    () => Subject,
    subject => subject.creator,
  )
  createSubjectRequests: Subject[]

  @Transform(transformToId)
  @Expose({ groups: [UserRolesType.ADMIN, AccessLevelType.OWN] })
  @OneToMany(
    () => Topic,
    topic => topic.creator,
  )
  createTopicRequests: Subject[]

  @Transform(transformToId)
  @Expose({ groups: [UserRolesType.USER] })
  @ManyToMany(
    () => Subject,
    subject => subject.teachers,
  )
  @JoinTable()
  teachSubjects: Subject[]

  @Transform(transformToId)
  @Expose({ groups: [UserRolesType.USER] })
  @ManyToMany(
    () => Subject,
    subject => subject.teachers,
  )
  @JoinTable()
  studies: Study[]

  @Transform(transformToId)
  @Expose({ groups: [UserRolesType.ADMIN, AccessLevelType.OWN] })
  @OneToMany(
    () => Test,
    test => test.creator,
  )
  tests: Test[]
}
