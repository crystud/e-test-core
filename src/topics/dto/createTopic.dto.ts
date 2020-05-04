import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString, Length } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTopicDto {
  @ApiProperty()
  @IsString()
  @Length(1, 50)
  @Type(() => String)
  name: string

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  subject: number
}
