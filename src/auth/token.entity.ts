import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../users/user.entity'

@Entity('tokens')
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Generated('uuid')
  readonly value: string

  @Column({ default: true })
  active: boolean

  @ManyToOne(
    () => User,
    user => user.tokens,
    {
      nullable: false,
    },
  )
  readonly user: User

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  usedAt: Date
}
