import { Exclude, Expose } from 'class-transformer'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { Speciality } from '../specialties/speciality.entity'
import * as moment from 'moment'
import { now } from 'moment'

@Exclude()
@Entity('groups')
export class Group extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number

  @Expose()
  @Column({ type: 'smallint' })
  startYear: number

  @Expose()
  @Column({ type: 'tinyint' })
  number: number

  @Expose()
  @ManyToOne(
    () => Speciality,
    speciality => speciality.groups,
  )
  speciality: Speciality

  @Expose({ name: 'course' })
  get _course(): number {
    return Math.abs(
      Math.round(
        moment(new Date(`01/09/${this.startYear}`)).diff(now(), 'years', true),
      ),
    )
  }

  @Expose({ name: 'name' })
  get _name(): string {
    return `${this.speciality.symbol}-${this._course}${this.number}`
  }
}
