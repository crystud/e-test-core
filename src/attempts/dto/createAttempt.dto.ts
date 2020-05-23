import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateAttemptDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  ticket: number
}
