import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ResultSelectingMethodType } from '../enums/resultSelectingMethodType'

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

  @ApiProperty({
    enum: Object.keys(ResultSelectingMethodType).filter(
      x => !(parseInt(x) >= 0),
    ),
  })
  @IsEnum(ResultSelectingMethodType)
  @Transform(type => ResultSelectingMethodType[type])
  resultSelectingMethod: ResultSelectingMethodType =
    ResultSelectingMethodType.LAST_RESULT

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  group: number

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  test: number
}
