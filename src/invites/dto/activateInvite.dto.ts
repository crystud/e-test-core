import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Length } from 'class-validator'

export class ActivateInviteDto {
  @ApiProperty()
  code: string

  @ApiProperty()
  @Length(8)
  password: string

  @ApiProperty()
  @IsEmail()
  email: string
}
