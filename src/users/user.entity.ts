import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'

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
}
