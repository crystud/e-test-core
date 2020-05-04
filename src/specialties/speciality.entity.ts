import { Exclude, Expose } from 'class-transformer'
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Group } from '../groups/group.entity'

@Exclude()
@Entity('specialties')
export class Speciality extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number

  @Expose()
  @Column({ type: 'varchar', length: 50 })
  name: string

  @Expose()
  @Column({ type: 'varchar', length: 8 })
  symbol: string

  @Expose()
  @Column({ type: 'tinyint' })
  yearOfStudy: number

  @Expose()
  @Column({ unique: true, type: 'smallint' })
  code: number

  @Expose()
  @OneToMany(
    () => Group,
    group => group.speciality,
  )
  groups: Group[]
}
