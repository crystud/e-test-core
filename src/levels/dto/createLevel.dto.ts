import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, Min } from 'class-validator'

export class CreateLevelDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string

  @ApiProperty({ default: 1 })
  @Min(0)
  difficult: number

  @ApiProperty()
  @IsInt()
  test: number

  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(0)
  countOfTask: number
}
