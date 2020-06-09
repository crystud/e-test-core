import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateStudentDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  user: number

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  group: number

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  scoringBook: number
}
