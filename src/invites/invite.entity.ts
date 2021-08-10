import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Student } from '../students/student.entity'

@Entity('invites')
export class Invite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date

  @Column({ type: 'datetime', default: null, nullable: true })
  usedAt: Date | null

  @Column({ type: 'varchar', length: 14, unique: true })
  code: string

  @OneToOne(
    () => Student,
    student => student.invite,
  )
  @JoinColumn({ name: 'student_id' })
  student: Student

  @ManyToOne(
    () => User,
    user => user.invites,
  )
  @JoinColumn({ name: 'creator_id' })
  creator: User
}
