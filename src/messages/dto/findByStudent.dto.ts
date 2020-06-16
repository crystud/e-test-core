import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class FindByStudentDto {
  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Min(0)
  @Max(15)
  @IsOptional()
  @Type(() => Number)
  limit = 15

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  student: number
}
