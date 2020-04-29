import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, Min } from 'class-validator'

export class CreateAnswerDto {
  @ApiProperty()
  text: string

  @ApiProperty({ required: false, default: -1 })
  position?: number

  @ApiProperty()
  @IsBoolean()
  correct: boolean

  @ApiProperty()
  @IsInt()
  @Min(0)
  task: number
}
