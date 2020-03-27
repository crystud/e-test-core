import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, Max, Min } from 'class-validator'

export class CreateSpecialityDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Length(1, 5)
  symbol: string

  @ApiProperty()
  @Min(1)
  @Max(6)
  yearOfStudy: number

  @ApiProperty()
  @IsNotEmpty()
  college: number
}
