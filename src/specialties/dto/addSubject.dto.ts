import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class AddSubjectDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  speciality: number

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  subject: number
}
