import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNumber, Length } from 'class-validator'

export class CreateGroupDto {
  @ApiProperty()
  @Length(1, 5)
  symbol: string

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
