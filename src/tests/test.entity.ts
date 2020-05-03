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
import { Expose } from 'class-transformer'

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

  @ManyToMany(
    () => Study,
    study => study.tests,
  )
  @JoinTable()
  studies: Study[]

  @ManyToOne(
    () => Subject,
    subject => subject.tests,
    {
      nullable: false,
    },
  )
  subject: Subject

  @ManyToOne(
    () => User,
    user => user.tests,
    {
      nullable: false,
    },
  )
  creator: User

  @ManyToMany(
    () => College,
    college => college.tests,
  )
  @JoinTable()
  colleges: College[]

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @OneToMany(
    () => Level,
    level => level.test,
  )
  levels: Level[]

  @OneToMany(
    () => Permission,
    permission => permission.test,
  )
  permissions: Permission[]
}
