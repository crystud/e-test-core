import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class CreateAnswerDto {
  @ApiProperty()
  text: string

  @ApiProperty({ required: false, default: -1 })
  position?: number

  @ApiProperty({ default: 1 })
  @IsInt()
  score: number

  @ApiProperty()
  @IsInt()
  @Min(0)
  task: number
}
