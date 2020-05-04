import { Exclude, Expose } from 'class-transformer'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { User } from '../users/user.entity'

@Exclude()
@Entity('students')
export class Student extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number

  @Expose()
  @ApiModelProperty()
  @Column({ type: 'int' })
  scoringBookCode: number

  @Expose({ groups: [UserRolesType.ADMIN] })
  @ApiModelProperty()
  @CreateDateColumn()
  createAt: Date

  @Expose()
  @ApiModelProperty({ type: () => User })
  @ManyToOne(
    () => User,
    user => user.students,
  )
  user: User
}
