import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class AddTeacherDto {
  @ApiProperty()
  @IsInt()
  teacher: number
}
