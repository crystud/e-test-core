import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Attempt } from '../attempts/attempt.entity'
import { UserRolesType } from '../enums/userRolesType'
import { ResultAnswer } from './resultAnswer.entity'
import { User } from '../users/user.entity'
import { Test } from '../tests/test.entity'

@Exclude()
@Entity('results')
export class Result extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty()
  @Column({ type: 'float', default: null })
  resultScore: number

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty()
  @Column({ type: 'float' })
  persents: number

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: () => Attempt })
  @OneToOne(
    () => Attempt,
    attempt => attempt.result,
  )
  @JoinColumn()
  attempt: Attempt

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: () => [ResultAnswer] })
  @OneToMany(
    () => ResultAnswer,
    resultAnswer => resultAnswer.result,
  )
  resultAnswers: ResultAnswer[]

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: () => User })
  @ManyToOne(
    () => User,
    user => user.results,
  )
  student: User

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ManyToOne(
    () => Test,
    test => test.results,
  )
  test: Test
}
