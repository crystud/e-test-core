import { ApiProperty } from '@nestjs/swagger'
import { IsBase64, IsInt, IsOptional, Length, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateAnswerDto {
  @ApiProperty()
  @Length(1, 128)
  @Type(() => String)
  answerText: string

  @ApiProperty({ required: false })
  @IsBase64()
  @IsOptional()
  image: string

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  position: number

  @ApiProperty()
  @Type(() => Boolean)
  correct: boolean

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  task: number
}
