import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Result } from './result.entity'

@Exclude()
@Entity('result_answers')
export class ResultAnswer extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose()
  @Column({ type: 'float' })
  retrievedScore: number

  @Expose()
  @Column({ type: 'float' })
  possibleScore: number

  @Expose()
  @Column({ type: 'simple-array' })
  correctAnswers: string[]

  @Expose()
  @Column({ type: 'simple-array' })
  incorrectAnswers: string[]

  @Expose()
  @ManyToOne(
    () => Result,
    result => result.resultAnswers,
  )
  result: Result
}
