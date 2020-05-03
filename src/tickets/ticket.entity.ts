import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Permission } from '../permissions/permission.entity'
import { User } from '../users/user.entity'

import { UserRolesType } from '../enums/userRolesType'

import { Attempt } from '../attempts/attempt.entity'

@Exclude()
@Entity('tickets')
export class Ticket extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty()
  @Column()
  title: string

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => Permission,
    permission => permission.tickets,
  )
  permission: Permission

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => User,
    user => user.tickets,
  )
  student: User

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => Attempt,
    attempt => attempt.ticket,
  )
  attempts: Attempt[]

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty()
  @Column({ default: false })
  used: boolean

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty()
  @Column({ type: 'datetime', default: null })
  usedTime: Date | null
}
