import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose, Transform } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Ticket } from '../tickets/ticket.entity'
import { UserRolesType } from '../enums/userRolesType'
import { AccessLevelType } from '../enums/accessLevelType'
import { transformToId } from '../tools/transformers/transformToId'
import { AttemptTask } from './attemptTask.entity'
import { User } from '../users/user.entity'

@Exclude()
@Entity('attempts')
export class Attempt extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.TEACHER,
    ],
  })
  @ApiModelProperty()
  @Column({ type: 'float' })
  maxScore: number

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.TEACHER,
    ],
  })
  @ApiModelProperty()
  @Column({ type: 'float', default: null })
  resultScore: number | null

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.TEACHER,
    ],
  })
  @ApiModelProperty()
  @Column({ default: null })
  endTime: Date | null

  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.TEACHER,
    ],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => Ticket,
    ticket => ticket.attempts,
  )
  ticket: Ticket

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
    user => user.attempts,
  )
  student: User

  @Transform(transformToId)
  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.STUDENT,
      AccessLevelType.TEACHER,
    ],
  })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => AttemptTask,
    attemptTask => attemptTask.attempt,
  )
  tasks: AttemptTask[]
}
