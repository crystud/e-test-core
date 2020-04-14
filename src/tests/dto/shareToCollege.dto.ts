import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class ShareToCollegeDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  college: number
}
