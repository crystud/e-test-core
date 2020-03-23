import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator'

export class CreateCollegeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  address: string

  @ApiProperty()
  @IsUrl()
  site: string

  @ApiProperty()
  @IsNotEmpty()
  EDBO: number
}
