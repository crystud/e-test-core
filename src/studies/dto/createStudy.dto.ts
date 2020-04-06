import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class CreateStudyDto {
  @ApiProperty()
  @IsInt()
  subject: number

  @ApiProperty()
  @IsInt()
  college: number
}
