import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Topic } from '../topics/topic.entity'
import { Teacher } from '../teachers/teachers.entity'
import { Transform } from 'class-transformer'
import { TaskType } from './enums/TaskType.enum'
import { Answer } from '../answers/answer.entity'

@Entity('tasks')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  question: string

  @Transform(image => {
    return image ? Buffer.from(image).toString() : null
  })
  @Column({ type: 'blob', nullable: true })
  image: string

  @Transform(type => TaskType[type])
  @Column({ type: 'smallint' })
  type: TaskType

  @Column({ type: 'mediumtext', nullable: true })
  attachment: string

  @ManyToOne(
    () => Topic,
    topic => topic.tasks,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'topic_id' })
  topic: Topic

  @ManyToOne(
    () => Teacher,
    teacher => teacher,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'creator_id' })
  creator: Teacher

  @OneToMany(
    () => Answer,
    answer => answer.task,
  )
  answers: Answer[]
}
