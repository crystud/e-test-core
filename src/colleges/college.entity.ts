import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../users/user.entity'

@Entity('colleges')
export class College extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column()
  address: string

  @Column({ default: false })
  confirmed: boolean

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  site: string

  @Column({ nullable: true })
  EDBO?: number

  @ManyToOne(
    () => User,
    user => user.ownColleges,
  )
  creator: User
}
