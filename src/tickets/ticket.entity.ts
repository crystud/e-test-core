import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose, Transform } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Permission } from '../permissions/permission.entity'
import { User } from '../users/user.entity'
import { transformToId } from '../tools/transformers/transformToId'
import { UserRolesType } from '../enums/userRolesType'
import { AccessLevelType } from '../enums/accessLevelType'

@Exclude()
@Entity('tickets')
export class Ticket extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.TEACHER,
    ],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => Permission,
    permission => permission.tickets,
  )
  permission: Permission

  @Transform(transformToId)
  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.TEACHER,
    ],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => User,
    user => user.tickets,
  )
  student: User

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.TEACHER,
    ],
  })
  @ApiModelProperty()
  @Column({ default: false })
  used: boolean

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.TEACHER,
    ],
  })
  @ApiModelProperty()
  @Column({ type: 'datetime', default: null })
  usedTime: Date | null
}
