import { Exclude, Expose } from 'class-transformer'
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { User } from '../users/user.entity'

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
  @JoinTable({ name: 'subject_teacher_user' })
  teachers: User
}
