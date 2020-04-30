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
import { Task } from '../tasks/task.entity'
import { UserRolesType } from '../enums/userRolesType'
import { transformToId } from '../tools/transformers/transformToId'
import { TaskTypes } from '../enums/TaskTypes.enum'
import { AttemptAnswer } from '../attempts/attemptAnswer.entity'

@Exclude()
@Entity('answers')
export class Answer extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({
    groups: [
      UserRolesType.USER,
      TaskTypes.TEXT_INPUT,
      TaskTypes.MULTY_CHOICE,
      TaskTypes.SINGLE_CHOICE,
    ],
  })
  @ApiModelProperty()
  @Column()
  text: string

  @Expose({
    groups: [
      UserRolesType.USER,
      TaskTypes.TEXT_INPUT,
      TaskTypes.MULTY_CHOICE,
      TaskTypes.SINGLE_CHOICE,
    ],
  })
  @ApiModelProperty()
  @Column()
  correct: boolean

  @Expose({ groups: [UserRolesType.USER, TaskTypes.NUMBERING] })
  @ApiModelProperty({
    description: `Position of answer for ${TaskTypes.NUMBERING}`,
  })
  @Column({ type: 'tinyint', default: -1 })
  position: number

  @Transform(transformToId)
  @Expose({
    groups: [
      UserRolesType.USER,
      TaskTypes.TEXT_INPUT,
      TaskTypes.MULTY_CHOICE,
      TaskTypes.SINGLE_CHOICE,
    ],
  })
  @ApiModelProperty({ type: [Number] })
  @ManyToOne(
    () => Task,
    task => task.answers,
  )
  task: Task

  @Exclude()
  @OneToMany(
    () => AttemptAnswer,
    attemptAnswer => attemptAnswer.answer,
  )
  attemptAnswers: AttemptAnswer
}
