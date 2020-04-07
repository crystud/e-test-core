import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class AddStudyDto {
  @ApiProperty()
  @IsInt()
  study: number
}
