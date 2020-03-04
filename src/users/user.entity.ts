import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm'

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
