import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Group } from '../groups/group.entity'

@Entity('message')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 512, nullable: false })
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
