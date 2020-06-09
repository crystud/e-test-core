import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ResultSelectingMethodEnum } from '../enums/resultSelectingMethod.enum'

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
    enum: Object.keys(ResultSelectingMethodEnum).filter(
      x => !(parseInt(x) >= 0),
    ),
  })
  @IsEnum(ResultSelectingMethodEnum)
  @Transform(type => ResultSelectingMethodEnum[type])
  resultSelectingMethod: ResultSelectingMethodEnum =
    ResultSelectingMethodEnum.BEST_RESULT

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  group: number

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  test: number
}
