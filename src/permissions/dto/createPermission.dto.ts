import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreatePermissionDto {
  @ApiProperty()
  @Type(() => Date)
  startTime: Date

  @ApiProperty({ description: 'Set null if end time is infinity' })
  @IsOptional()
  @Type(() => Date)
  endTime: Date | null

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(255)
  @IsOptional()
  maxCountOfUse: number | null

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  group: number

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  test: number
}
