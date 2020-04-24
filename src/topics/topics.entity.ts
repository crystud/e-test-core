import { Exclude, Expose, Transform } from 'class-transformer'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { AccessLevelType } from '../enums/accessLevelType'
import { transformToId } from '../tools/transformers/transformToId'
import { User } from '../users/user.entity'
import { Subject } from '../subjects/subject.entity'

@Exclude()
@Entity('topics')
export class Topic extends BaseEntity {
  @Expose()
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number

  @Expose({ groups: [UserRolesType.USER] })
  @ApiModelProperty()
  @Column({ unique: true })
  name: string

  @Expose({ groups: [UserRolesType.ADMIN, AccessLevelType.OWNER] })
  @ApiModelProperty()
  @Column({ default: false })
  confirmed: boolean

  @Transform(transformToId)
  @Expose({
    groups: [UserRolesType.ADMIN, AccessLevelType.OWNER],
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

  @Transform(transformToId)
  @Expose({
    groups: [UserRolesType.USER],
  })
  @ApiModelProperty({ type: Number })
  @ManyToOne(
    () => Subject,
    subject => subject.topics,
    {
      nullable: false,
    },
  )
  subject: Subject
}
