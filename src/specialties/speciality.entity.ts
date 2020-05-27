import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Group } from '../groups/group.entity'
import { Subject } from '../subject/subject.entity'

@Entity('specialties')
export class Speciality extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50 })
  name: string

  @Column({ type: 'varchar', length: 8 })
  symbol: string

  @Column({ name: 'year_of_studt', type: 'tinyint' })
  yearOfStudy: number

  @Column({ unique: true, type: 'smallint' })
  code: number

  @OneToMany(
    () => Group,
    group => group.speciality,
  )
  groups: Group[]

  @ManyToMany(
    () => Subject,
    subject => subject.specialties,
  )
  subjects: Subject[]
}
