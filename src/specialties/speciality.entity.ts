import { Exclude, Expose } from 'class-transformer'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'

@Exclude()
@Entity('speciality')
export class Speciality extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number

  @Column({ type: 'varchar', length: 50 })
  name: string

  @Column({ type: 'varchar', length: 8 })
  symbol: string

  @Column({ type: 'smallint' })
  yearOfStudy: number

  @Column({ unique: true })
  code: number
}
