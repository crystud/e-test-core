import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'

@Entity('tokens')
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  value: string

  @Column()
  active: boolean

  @Column()
  validUntil: Date

  @CreateDateColumn()
  createAt: Date

  @ManyToOne(
    () => User,
    user => user.tokens,
  )
  @JoinColumn()
  user: User[]
}
