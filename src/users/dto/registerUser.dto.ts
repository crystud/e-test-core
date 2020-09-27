import { ApiProperty } from '@nestjs/swagger'
import { IsBase64, IsEmail, IsOptional, Length } from 'class-validator'

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

  @ApiProperty({ required: false })
  @IsBase64()
  @Length(0, ((64 * 1024) / 3) * 4, {
    message: 'Максимальний розмір файлу 64KB',
  })
  @IsOptional()
  avatar: string = null

  @ApiProperty()
  @Length(8)
  password: string

  @ApiProperty()
  @IsEmail()
  email: string
}
