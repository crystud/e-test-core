import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
} from 'typeorm'
import { Exclude, Transform } from 'class-transformer'
import { Token } from '../auth/token.entity'
import { College } from '../colleges/college.entity'
import { transformToId } from '../tools/transformers/transformToId'

export enum UserRolesType {
  ADMIN = 'admin',
  USER = 'user',
  GHOST = 'ghost',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  patronymic: string

  @Exclude()
  @Column()
  password: string

  @Column({
    unique: true,
  })
  email: string

  @Column({
    type: 'set',
    enum: UserRolesType,
    default: [UserRolesType.GHOST],
  })
  roles: UserRolesType[]

  @CreateDateColumn()
  createAt: Date

  @Exclude()
  @OneToOne(
    () => Token,
    token => token.user,
  )
  tokens: Token[]

  @Transform(transformToId)
  @ManyToMany(
    () => College,
    college => college.editors,
  )
  @JoinColumn()
  editableColleges: College[]

  @Transform(transformToId)
  @OneToMany(
    () => College,
    college => college.creator,
  )
  ownColleges: College[]
}
