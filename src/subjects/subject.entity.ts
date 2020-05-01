import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { College } from '../colleges/college.entity'
import { Exclude, Expose, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Study } from '../studies/study.entity'
import { Topic } from '../topics/topics.entity'
import { Test } from '../tests/test.entity'
import { UserRolesType } from '../enums/userRolesType'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'

@Exclude()
@Entity('subjects')
export class Subject extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ unique: true })
  name: string

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ default: false })
  confirmed: boolean

  @Expose({ groups: [UserRolesType.ADMIN] })
  @ApiModelProperty({ type: Number })
  @Transform(transformToId)
  @ManyToOne(
    () => User,
    user => user.createSubjectRequests,
    {
      nullable: false,
    },
  )
  creator: User

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({ type: [Number] })
  @Transform(transformToId)
  @ManyToMany(
    () => User,
    user => user.teachSubjects,
  )
  teachers: User[]

  @Expose({ groups: [UserRolesType.ADMIN] })
  @ApiModelProperty({ type: [Number] })
  @Transform(transformToId)
  @ManyToMany(
    () => College,
    college => college.subjects,
  )
  @JoinTable()
  colleges: College[]

  @Expose({ groups: [UserRolesType.ADMIN] })
  @ApiModelProperty({ type: [Number] })
  @Exclude()
  @OneToMany(
    () => Study,
    study => study.subject,
  )
  studies: Study[]

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({ type: [Number] })
  @Transform(transformToId)
  @OneToMany(
    () => Topic,
    topic => topic.subject,
  )
  topics: Topic[]

  @Expose({ groups: [UserRolesType.ADMIN] })
  @ApiModelProperty({ type: [Number] })
  @Exclude()
  @OneToMany(
    () => Test,
    topic => topic.subject,
  )
  tests: Test[]
}
