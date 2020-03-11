import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Length } from 'class-validator'

export class RegisterUserDto {
  @ApiProperty()
  @Length(2, 40)
  firstName: string

  @ApiProperty()
  @Length(2, 40)
  lastName: string

  @ApiProperty()
  @Length(2, 40)
  patronymic: string

  @ApiProperty()
  @Length(8)
  password: string

  @ApiProperty()
  @IsEmail()
  email: string
}
