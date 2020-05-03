import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Exclude, Expose } from 'class-transformer'

import { Speciality } from '../specialties/speciality.entity'
import { Subject } from '../subjects/subject.entity'
import { Study } from '../studies/study.entity'
import { Test } from '../tests/test.entity'
import { UserRolesType } from '../enums/userRolesType'

import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'

@Exclude()
@Entity('colleges')
export class College extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ unique: true })
  name: string

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column()
  address: string

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ default: false })
  confirmed: boolean

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ unique: true })
  email: string

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ unique: true })
  site: string

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ nullable: true })
  EDBO?: number

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => User,
    user => user.ownColleges,
    {
      nullable: false,
    },
  )
  creator: User

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => Speciality,
    speciality => speciality.college,
  )
  specialties: Speciality[]

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: [Number] })
  @ManyToMany(
    () => User,
    user => user.editableColleges,
  )
  editors: User[]

  @Exclude()
  @Expose({
    groups: [UserRolesType.ADMIN],
  })
  @ApiModelProperty({ type: [Number] })
  @ManyToMany(
    () => Subject,
    subject => subject.colleges,
  )
  subjects: Subject[]

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: [Number] })
  @ManyToMany(
    () => Test,
    test => test.colleges,
  )
  tests: Test[]

  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => Study,
    study => study.college,
  )
  studies: Study[]
}
