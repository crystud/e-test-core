import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class CreatePermissionDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  testId: number

  @ApiProperty({ type: [Number], default: [] })
  @IsInt({ each: true })
  @Min(0, { each: true })
  groups: number[]

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(0)
  study: number

  @ApiProperty()
  startTime: Date

  @ApiProperty()
  endTime: Date
}
