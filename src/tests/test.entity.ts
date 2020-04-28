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
import { Study } from '../studies/study.entity'
import { User } from '../users/user.entity'
import { Exclude, Expose, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Subject } from '../subjects/subject.entity'
import { College } from '../colleges/college.entity'
import { Level } from '../levels/level.entity'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { Permission } from '../permissions/permission.entity'

@Entity('tests')
export class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  isPublic: boolean

  @Exclude()
  @ManyToMany(
    () => Study,
    study => study.tests,
  )
  @JoinTable()
  studies: Study[]

  @Transform(transformToId)
  @ManyToOne(
    () => Subject,
    subject => subject.tests,
    {
      nullable: false,
    },
  )
  subject: Subject

  @Transform(transformToId)
  @ManyToOne(
    () => User,
    user => user.tests,
    {
      nullable: false,
    },
  )
  creator: User

  @Transform(transformToId)
  @ManyToMany(
    () => College,
    college => college.tests,
  )
  @JoinTable()
  colleges: College[]

  @Transform(transformToId)
  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @OneToMany(
    () => Level,
    level => level.test,
  )
  levels: Level[]

  @Exclude()
  @OneToMany(
    () => Permission,
    permission => permission.test,
  )
  permissions: Permission[]
}
