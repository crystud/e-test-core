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
import { Exclude, Transform } from 'class-transformer'
import { Admin } from '../admins/admin.entity'
import { Task } from '../tasks/task.entity'
import { Test } from '../tests/test.entity'
import { Invite } from '../invites/invite.entity'
import { Message } from '../messages/message.entity'

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
  @Column({ type: 'varchar', length: 60, nullable: true })
  password: string | null

  @Transform(image => {
    return image ? Buffer.from(image).toString() : null
  })
  @Column({ type: 'mediumblob', nullable: true })
  avatar: string | null

  @Column({
    unique: true,
    nullable: true,
  })
  email: string | null

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

  @OneToMany(
    () => Task,
    task => task.creator,
  )
  tasks: Test[]

  @OneToMany(
    () => Invite,
    invite => invite.creator,
  )
  invites: Invite[]

  @OneToMany(
    () => Message,
    message => message.sender,
  )
  sendedMessages: Message[]
}
