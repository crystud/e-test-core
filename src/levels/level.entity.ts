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
import { UserRolesType } from '../enums/userRolesType'
import { transformToId } from '../tools/transformers/transformToId'
import { Test } from '../tests/test.entity'
import { Task } from '../tasks/task.entity'

@Exclude()
@Entity('levels')
export class Level extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ unique: true })
  title: string

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ unique: true, default: 1 })
  difficult: number

  @Transform(transformToId)
  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => Test,
    test => test.levels,
    {
      nullable: false,
    },
  )
  test: Test

  @Transform(transformToId)
  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => Task,
    task => task.level,
  )
  tasks: Task[]
}
