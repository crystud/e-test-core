import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Teacher } from '../teachers/teachers.entity'

@Entity('tests')
export class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 80 })
  name: string

  @ManyToOne(
    () => Teacher,
    teacher => teacher.tests,
  )
  @JoinColumn({ name: 'creator_id' })
  creator: Teacher
}
