import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString, Length } from 'class-validator'

export class CreateSpecialityDto {
  @ApiProperty()
  @Length(1, 50)
  name: string

  @ApiProperty()
  @IsInt()
  code: number

  @ApiProperty()
  @IsInt()
  yearOfStudy: number

  @ApiProperty()
  @Length(1, 8)
  @IsString()
  symbol: string
}
