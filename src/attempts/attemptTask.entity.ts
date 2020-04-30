import { Exclude, Expose, Transform } from 'class-transformer'
import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Task } from '../tasks/task.entity'
import { TaskTypes } from '../enums/TaskTypes.enum'
import { AttemptAnswer } from './attemptAnswer.entity'
import { transformToId } from '../tools/transformers/transformToId'
import { Level } from '../levels/level.entity'
import { Attempt } from './attempt.entity'

@Exclude()
@Entity('attempt_tasks')
export class AttemptTask extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose()
  get ask(): string | null {
    return this.task?.ask ? this.task.ask : null
  }

  @Expose()
  get description(): string | null {
    return this.task?.description ? this.task.description : null
  }

  @Expose()
  get type(): TaskTypes | null {
    return this.task?.type ? this.task.type : null
  }

  @Exclude()
  @ManyToOne(
    () => Task,
    task => task.attempt_tasks,
  )
  task: Task

  @Exclude()
  @ManyToOne(
    () => Task,
    task => task.attempt_tasks,
  )
  level: Level

  @Transform(transformToId)
  @Expose()
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => Attempt,
    attempt => attempt.tasks,
  )
  attempt: Attempt

  @Transform(transformToId)
  @Expose()
  @OneToMany(
    () => AttemptAnswer,
    attemptAnswer => attemptAnswer.attemptTask,
  )
  attemptAnswers: AttemptAnswer[]
}
