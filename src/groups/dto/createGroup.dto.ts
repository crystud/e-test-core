import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNumber } from 'class-validator'

export class CreateGroupDto {
  @ApiProperty()
  @IsNumber()
  speciality: number

  @ApiProperty()
  @IsDateString()
  startEducation: Date

  @ApiProperty()
  @IsDateString()
  endEducation: Date
}
