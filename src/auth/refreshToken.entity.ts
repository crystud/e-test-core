import {
  BaseEntity,
  Column,
  Entity, Generated,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Token } from './token.entity'

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Generated('uuid')
  value: string

  @Column({ default: true })
  active: boolean

  @OneToOne(() => Token)
  @JoinColumn()
  token: Token
}
