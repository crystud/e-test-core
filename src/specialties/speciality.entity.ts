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

@Entity('specialties')
export class Speciality extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Transform(transformToId)
  @ManyToOne(
    () => College,
    college => college.specialties,
  )
  college: College
}
