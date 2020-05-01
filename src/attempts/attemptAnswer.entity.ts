import { Exclude, Expose, Transform } from 'class-transformer'
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { AttemptTask } from './attemptTask.entity'
import { transformToId } from '../tools/transformers/transformToId'
import { Answer } from '../answers/answer.entity'

@Exclude()
@Entity('attempt_answers')
export class AttemptAnswer extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose()
  get text(): string | null {
    return this.answer?.text ? this.answer.text : null
  }

  @Exclude()
  @ManyToOne(
    () => Answer,
    answer => answer.attemptAnswers,
  )
  answer: Answer

  @Transform(transformToId)
  @Expose()
  @ManyToOne(
    () => AttemptTask,
    attemptTask => attemptTask.attemptAnswers,
  )
  attemptTask: AttemptTask
}
