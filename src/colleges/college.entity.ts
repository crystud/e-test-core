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
import { Exclude, Expose, Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Speciality } from '../specialties/speciality.entity'
import { Subject } from '../subjects/subject.entity'
import { Study } from '../studies/study.entity'
import { Test } from '../tests/test.entity'
import { UserRolesType } from '../enums/userRolesType'
import { AccessLevelType } from '../enums/accessLevelType'
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

  @Expose({ groups: [UserRolesType.ADMIN, AccessLevelType.OWNER] })
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

  @Transform(transformToId)
  @Expose({ groups: [UserRolesType.ADMIN, AccessLevelType.OWNER] })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => User,
    user => user.ownColleges,
    {
      nullable: false,
    },
  )
  creator: User

  @Transform(transformToId)
  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => Speciality,
    speciality => speciality.college,
  )
  specialties: Speciality[]

  @Transform(transformToId)
  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.OWNER,
      AccessLevelType.EDITOR,
    ],
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

  @Transform(transformToId)
  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.OWNER,
      AccessLevelType.EDITOR,
      AccessLevelType.TEACHER,
    ],
  })
  @ApiModelProperty({ type: [Number] })
  @ManyToMany(
    () => Test,
    test => test.colleges,
  )
  tests: Test[]

  @Transform(transformToId)
  @Expose({
    groups: [
      UserRolesType.ADMIN,
      AccessLevelType.OWNER,
      AccessLevelType.EDITOR,
      AccessLevelType.TEACHER,
      AccessLevelType.STUDENT,
    ],
  })
  @ApiModelProperty({ type: [Number] })
  @OneToMany(
    () => Study,
    study => study.college,
  )
  studies: Study[]
}
