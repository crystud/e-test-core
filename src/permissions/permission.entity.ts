import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose, Transform } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { User } from '../users/user.entity'
import { Test } from '../tests/test.entity'
import { UserRolesType } from '../enums/userRolesType'
import { transformToId } from '../tools/transformers/transformToId'
import { Group } from '../groups/group.entity'
import { Ticket } from '../tickets/ticket.entity'
import { AccessLevelType } from '../enums/accessLevelType'
import { Study } from '../studies/study.entity'
import moment = require('moment')

@Exclude()
@Entity('permissions')
export class Permission extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Transform(transformToId)
  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.ALLOWER,
    ],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => User,
    user => user.permissions,
  )
  allower: User

  @Transform(transformToId)
  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.ALLOWER,
    ],
  })
  )
  test: Test

  @Transform(transformToId)
  @Expose({
    groups: [UserRolesType.ADMIN, AccessLevelType.ALLOWER],
  })
  @ApiModelProperty({
    type: [Number],
    description: 'Groups which can start testing',
  })
  @ManyToMany(
    () => Group,
    group => group.permissions,
  )
  @JoinTable()
  groups: Group[]

  @Transform(transformToId)
  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.ALLOWER,
      AccessLevelType.STUDENT,
    ],
  })
  @ApiModelProperty({
    type: Number,
  })
  @ManyToOne(
    () => Study,
    study => study.permissions,
  )
  study: Study

  @Transform(transformToId)
  @Expose({
    groups: [UserRolesType.ADMIN, AccessLevelType.ALLOWER],
  })
  @ApiModelProperty({
    type: [Number],
  })
  @OneToMany(
    () => Ticket,
    ticket => ticket.permission,
  )
  tickets: Ticket[]

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.ALLOWER,
    ],
  })
  @ApiModelProperty()
  @CreateDateColumn()
  createAt: Date

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.ALLOWER,
    ],
  })
  @ApiModelProperty({
    description: 'Time when students can start passing the test',
  })
  @Column({ type: 'datetime' })
  startTime: Date

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.ALLOWER,
    ],
  })
  @ApiModelProperty({
    description: 'Time when students already cannot start passing the test',
  })
  @Column({ type: 'datetime' })
  endTime: Date

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.ALLOWER,
    ],
  })
  get actived(): boolean {
    return moment().isBetween(this.startTime, this.endTime)
  }
}
