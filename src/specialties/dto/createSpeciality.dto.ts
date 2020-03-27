import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class CreateSpecialityDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Length(1, 5)
  symbol: string

  @ApiProperty()
  @IsNotEmpty()
  college: number
}
