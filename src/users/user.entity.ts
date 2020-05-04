import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { Token } from '../auth/token.entity'

import { UserRolesType } from '../enums/userRolesType'

import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Subject } from '../subject/subject.entity'
import { Group } from '../groups/group.entity'

@Exclude()
@Entity('users')
export class User extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number

  @Expose()
  @ApiModelProperty()
  @Column()
  firstName: string

  @Expose()
  @ApiModelProperty()
  @Column()
  lastName: string

  @Expose()
  @ApiModelProperty()
  @Column()
  patronymic: string

  @Exclude()
  @Column()
  password: string

  @Expose()
  @ApiModelProperty()
  @Column({
    unique: true,
  })
  email: string

  @Expose()
  @ApiModelProperty()
  @Column({
    type: 'set',
    enum: UserRolesType,
    default: [UserRolesType.GHOST],
  })
  roles: UserRolesType[]

  @Expose()
  @ApiModelProperty()
  @CreateDateColumn()
  createAt: Date

  @Expose()
  @OneToMany(
    () => Token,
    token => token.user,
  )
  tokens: Token[]

  @Expose()
  @ManyToMany(
    () => Subject,
    subject => subject.teachers,
  )
  subjects: Subject[]

  @Expose()
  @ManyToMany(
    () => Group,
    group => group.students,
  )
  groups: Group[]
}
