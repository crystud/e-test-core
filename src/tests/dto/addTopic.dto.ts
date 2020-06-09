import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class AddTopicDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  test: number

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  topic: number
}
