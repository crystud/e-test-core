import { Exclude, Expose } from 'class-transformer'
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { User } from '../users/user.entity'
import { Topic } from '../topics/topic.entity'

@Exclude()
@Entity('subject')
export class Subject extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number

  @Expose()
  @Column({ type: 'varchar', length: '50', unique: true })
  name: string

  @Expose()
  @ManyToMany(
    () => User,
    user => user.subjects,
  )
  @JoinTable({ name: 'teachers' })
  teachers: User[]

  @Expose()
  @OneToMany(
    () => Topic,
    topic => topic.subject,
  )
  topics: User[]
}
