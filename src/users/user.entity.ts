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
import { Exclude, Expose } from 'class-transformer'
import { Token } from '../auth/token.entity'

import { Subject } from '../subjects/subject.entity'
import { Test } from '../tests/test.entity'
import { UserRolesType } from '../enums/userRolesType'
import { AccessLevelType } from '../enums/accessLevelType'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'

import { Ticket } from '../tickets/ticket.entity'
import { Attempt } from '../attempts/attempt.entity'
import { Result } from '../results/result.entity'

@Exclude()
@Entity('users')
export class User extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @Column()
  firstName: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @Column()
  lastName: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @Column()
  patronymic: string

  @Column()
  password: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @Column({
    unique: true,
  })
  email: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @Column({
    type: 'set',
    enum: UserRolesType,
    default: [UserRolesType.GHOST],
  })
  roles: UserRolesType[]

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @CreateDateColumn()
  createAt: Date

  @OneToMany(
    () => Token,
    token => token.user,
  )
  tokens: Token[]

  @Expose({ groups: [UserRolesType.ADMIN, AccessLevelType.OWNER] })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => Subject,
    subject => subject.creator,
  )
  createSubjectRequests: Subject[]

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({ type: [Number] })
  @ManyToMany(
    () => Subject,
    subject => subject.teachers,
  )
  @JoinTable()
  teachSubjects: Subject[]

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => Test,
    test => test.creator,
  )
  tests: Test[]

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => Result,
    result => result.student,
  )
  results: Result[]

  @Expose({ groups: [UserRolesType.USER] })
  @OneToMany(
    () => Ticket,
    ticket => ticket.student,
  )
  tickets: Ticket[]

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({ type: [Number], description: 'Active testing' })
  @OneToMany(
    () => Attempt,
    attempt => attempt.student,
  )
  attempts: Attempt[]
}
