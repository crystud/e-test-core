import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export class FindUsersByIdsDto {
  @ApiProperty({ type: [Number] })
  @IsInt({ each: true })
  @Type(() => Number)
  ids: number[]
}
