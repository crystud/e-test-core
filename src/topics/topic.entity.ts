import { Exclude, Expose } from 'class-transformer'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'

import { Subject } from '../subject/subject.entity'

@Exclude()
@Entity('topics')
export class Topic extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number

  @Expose()
  @Column({ type: 'varchar', length: '50', unique: true })
  name: string

  @Expose()
  @ManyToOne(
    () => Subject,
    subject => subject.topics,
  )
  subject: Subject
}
