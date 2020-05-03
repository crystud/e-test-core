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
import { Exclude, Expose } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { User } from '../users/user.entity'
import { Test } from '../tests/test.entity'
import { UserRolesType } from '../enums/userRolesType'

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

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => User,
    user => user.permissions,
  )
  allower: User

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ManyToOne(
    () => Test,
    test => test.permissions,
  )
  test: Test

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

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({
    type: Number,
  })
  @ManyToOne(
    () => Study,
    study => study.permissions,
  )
  study: Study

  @Expose({
    groups: [UserRolesType.USER],
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
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty()
  @CreateDateColumn()
  createAt: Date

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({
    description: 'Time when students can start passing the test',
  })
  @Column({ type: 'datetime' })
  startTime: Date

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({
    description: 'Time when students already cannot start passing the test',
  })
  @Column({ type: 'datetime' })
  endTime: Date

  @Expose({
    groups: [UserRolesType.USER],
  })
  get actived(): boolean {
    return moment().isBetween(this.startTime, this.endTime)
  }
}
