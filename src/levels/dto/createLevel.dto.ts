import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, Min } from 'class-validator'

export class CreateLevelDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string

  @ApiProperty()
  @Min(0)
  difficult: number

  @ApiProperty()
  @IsInt()
  test: number
}
