import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
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
  @JoinColumn({ name: 'user_id' })
  readonly user: User

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date

  @UpdateDateColumn({ name: 'used_at' })
  usedAt: Date
}
