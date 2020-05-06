import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Token } from '../auth/token.entity'

import { Student } from '../students/student.entity'

import { Teacher } from '../teachers/teachers.entity'
import { Exclude } from 'class-transformer'
import { Admin } from '../admins/admin.entity'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'first_name', type: 'varchar', length: 40 })
  firstName: string

  @Column({ name: 'last_name', type: 'varchar', length: 40 })
  lastName: string

  @Column({ type: 'varchar', length: 40 })
  patronymic: string

  @Exclude()
  @Column()
  password: string

  @Column({
    unique: true,
  })
  email: string

  @OneToOne(
    () => Admin,
    admin => admin.user,
  )
  admin: Admin

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date

  @OneToMany(
    () => Token,
    token => token.user,
  )
  tokens: Token[]

  @OneToMany(
    () => Teacher,
    teacher => teacher.user,
  )
  teachers: Teacher[]

  @OneToMany(
    () => Student,
    student => student.user,
  )
  students: Student[]
}
