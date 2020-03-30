import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { College } from '../colleges/college.entity'
import { Transform } from 'class-transformer'
import { transformToId } from '../tools/transformers/transformToId'
import { Group } from '../groups/group.entity'

@Entity('specialties')
export class Speciality extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'varchar', length: 8 })
  symbol: string

  @Column({ type: 'smallint' })
  yearOfStudy: number

  @Transform(transformToId)
  @ManyToOne(
    () => College,
    college => college.specialties,
  )
  college: College

  @Transform(transformToId)
  @OneToMany(
    () => Group,
    group => group.speciality,
  )
  groups: Group[]
}
