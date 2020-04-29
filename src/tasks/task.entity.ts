import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose, Transform } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { transformToId } from '../tools/transformers/transformToId'
import { Topic } from '../topics/topics.entity'
import { Level } from '../levels/level.entity'
import { TaskTypes } from '../enums/TaskTypes.enum'
import { Answer } from '../answers/answer.entity'

@Exclude()
@Entity('tasks')
export class Task extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column()
  ask: string

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({
    description: `Ignore when type isn't ${TaskTypes.TEXT_INPUT}`,
  })
  @Column({ default: false })
  ignoreCase: boolean

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column()
  description: string

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column()
  type: TaskTypes

  @Transform(transformToId)
  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => Topic,
    topic => topic.tasks,
    {
      nullable: false,
    },
  )
  topic: Topic

  @Exclude()
  @ManyToMany(
    () => Level,
    level => level.tasks,
  )
  levels: Level[]

  @Transform(transformToId)
  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => Answer,
    answer => answer.task,
  )
  answers: Answer[]

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  get maxScore(): number {
    let sum = 0
    this.answers.forEach(answers => (sum += Number(answers.correct)))

    return sum
  }
}
