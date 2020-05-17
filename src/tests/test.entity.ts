import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Teacher } from '../teachers/teachers.entity'
import { Task } from '../tasks/task.entity'
import { Topic } from '../topics/topic.entity'
import { Permission } from '../permissions/permission.entity'

@Entity('tests')
export class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 80, nullable: false })
  name: string

  @Column({ type: 'tinyint', nullable: false })
  countOfTasks: number

  @ManyToOne(
    () => Teacher,
    teacher => teacher.tests,
  )
  @JoinColumn({ name: 'creator_id' })
  creator: Teacher

  @Column({ type: 'tinyint' })
  duration: number

  @ManyToMany(
    () => Task,
    task => task.tests,
  )
  @JoinTable({
    name: 'tests_tasks',
    joinColumn: {
      name: 'test_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'task_id',
      referencedColumnName: 'id',
    },
  })
  tasks: Task[]

  @ManyToMany(
    () => Topic,
    topic => topic.tests,
  )
  @JoinTable({
    name: 'tests_topics',
    joinColumn: {
      name: 'test_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'topic_id',
      referencedColumnName: 'id',
    },
  })
  topics: Topic[]

  @OneToMany(
    () => Permission,
    permission => permission.test,
  )
  permissions: Permission
}
