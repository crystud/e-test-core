import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { User } from '../users/user.entity'
import { Test } from '../tests/test.entity'
import { UserRolesType } from '../enums/userRolesType'

@Exclude()
@Entity('permissions')
export class Permission extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @ManyToOne(
    () => User,
    user => user.permissions,
  )
  allower: User

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @ManyToOne(
    () => Test,
    test => test.permissions,
  )
  test: Test

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @CreateDateColumn()
  createAt: Date

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({
    description: 'Time when students can start passing the test',
  })
  @Column({ type: 'datetime' })
  startTime: Date

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({
    description: 'Time when students already cannot start passing the test',
  })
  @Column({ type: 'datetime' })
  endTime: Date
}
