import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'

@Entity('admins')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(
    () => User,
    user => user.admin,
  )
  @JoinColumn({ name: 'user_id' })
  user: User
}
