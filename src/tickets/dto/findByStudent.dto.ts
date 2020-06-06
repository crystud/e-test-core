import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class FindByStudentDto {
  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  @Type(() => Number)
  limit = 10

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @Type(() => Boolean)
  onlyIsNotOutstanding: boolean

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @Type(() => Boolean)
  onlyUnused: boolean
}
