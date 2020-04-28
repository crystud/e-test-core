import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class CreatePermissionDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  testId: number

  @ApiProperty()
  startTime: Date

  @ApiProperty()
  endTime: Date
}
