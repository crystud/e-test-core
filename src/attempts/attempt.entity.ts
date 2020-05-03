import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Ticket } from '../tickets/ticket.entity'
import { UserRolesType } from '../enums/userRolesType'
import { AttemptTask } from './attemptTask.entity'
import { User } from '../users/user.entity'
import { Result } from '../results/result.entity'

@Exclude()
@Entity('attempts')
export class Attempt extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty()
  @Column({ type: 'float' })
  maxScore: number

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty()
  @Column({ default: null })
  endTime: Date | null

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => Ticket,
    ticket => ticket.attempts,
  )
  ticket: Ticket

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @OneToOne(
    () => Result,
    result => result.attempt,
  )
  result: Result

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => User,
    user => user.attempts,
  )
  student: User

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => AttemptTask,
    attemptTask => attemptTask.attempt,
  )
  tasks: AttemptTask[]
}
