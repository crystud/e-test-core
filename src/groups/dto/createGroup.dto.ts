import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateGroupDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  speciality: number

  @ApiProperty()
  @IsInt()
  @Min(2000)
  @Type(() => Number)
  startYear: number
}
