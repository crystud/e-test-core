import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { College } from '../colleges/college.entity'
import { Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'

@Entity('departments')
export class Department extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Transform(transformToId)
  @ManyToOne(
    () => College,
    college => college.departments,
  )
  college: College
}
