import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { College } from '../colleges/college.entity'

import { Group } from '../groups/group.entity'
import { Study } from '../studies/study.entity'

export enum SubjectStudyType {
  DAILY = 'daily',
  EXTERNAL = 'external',
}

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

  @Column({ unique: true })
  code: number

  @ManyToOne(
    () => College,
    college => college.specialties,
    {
      nullable: false,
    },
  )
  college: College

  @OneToMany(
    () => Group,
    group => group.speciality,
  )
  groups: Group[]

  @Column({
    type: 'set',
    enum: SubjectStudyType,
    default: [SubjectStudyType.DAILY, SubjectStudyType.EXTERNAL],
  })
  types: SubjectStudyType[]

  @ManyToMany(
    () => Study,
    study => study.specialties,
  )
  studies: Study[]
}
