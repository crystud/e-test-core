import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTeacherDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  user: number

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  subject: number
}
