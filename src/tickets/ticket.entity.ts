import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Student } from '../students/student.entity'
import { Permission } from '../permissions/permission.entity'

@Entity('tickets')
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date

  @ManyToOne(
    () => Student,
    student => student.tickets,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'student_id' })
  student: Student

  @ManyToOne(
    () => Permission,
    permission => permission.tickets,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'permission_id' })
  permission: Permission
}
