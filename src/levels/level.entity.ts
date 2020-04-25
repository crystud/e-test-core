import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
  @Column()
  title: string

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ default: 1, type: 'float' })
  difficult: number

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column()
  countOfTask: number

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
  @ManyToMany(
    () => Task,
    task => task.levels,
  )
  @JoinTable()
  tasks: Task[]

  @ApiModelProperty({
    type: Boolean,
    description:
      "Count of task is higher or equal equal then const 'countOfTask'. You cannot start testing without implementation this condition",
  })
  @Expose({
    groups: [UserRolesType.USER],
  })
  get complited(): boolean {
    return this.tasks.length >= this.countOfTask
  }
}
