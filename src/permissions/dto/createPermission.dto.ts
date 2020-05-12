import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class CreatePermissionDto {
  @ApiProperty()
  @Type(() => Date)
  startTime: Date

  @ApiProperty()
  @Type(() => Date)
  endTime: Date

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  group: number

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  test: number

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  teacher: number
}
