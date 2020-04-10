import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsString, Length } from 'class-validator'

export class CreateTestDto {
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  title: string

  @ApiProperty()
  @IsString()
  @Length(1, 255)
  description: string

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  isPublic? = false

  @ApiProperty()
  @IsInt()
  subject: number
}
