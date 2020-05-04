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
import { AccessLevelType } from '../enums/accessLevelType'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Subject } from '../subject/subject.entity'

@Exclude()
@Entity('users')
export class User extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @Column()
  firstName: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @Column()
  lastName: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @Column()
  patronymic: string

  @Column()
  password: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @Column({
    unique: true,
  })
  email: string

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @Column({
    type: 'set',
    enum: UserRolesType,
    default: [UserRolesType.GHOST],
  })
  roles: UserRolesType[]

  @Expose({ groups: [UserRolesType.USER, AccessLevelType.TOKEN] })
  @ApiModelProperty()
  @CreateDateColumn()
  createAt: Date

  @Exclude()
  @OneToMany(
    () => Token,
    token => token.user,
  )
  tokens: Token[]

  @Exclude()
  @ManyToMany(
    () => Subject,
    subject => subject.teachers,
  )
  subjects: Subject[]
}
