import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Group } from '../groups/group.entity'

@Entity('messages')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date

  @Column({ type: 'varchar', length: 512 })
  messageText: string

  @ManyToOne(
    () => User,
    user => user.sendedMessages,
  )
  @JoinColumn({ name: 'sender_id' })
  sender: User

  @ManyToMany(
    () => Group,
    group => group.messages,
  )
  @JoinTable({
    name: 'messages_groups',
    joinColumn: {
      name: 'message_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'group_id',
      referencedColumnName: 'id',
    },
  })
  groups: Group[]
}
