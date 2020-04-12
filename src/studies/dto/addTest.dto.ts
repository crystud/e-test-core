import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class AddTestDto {
  @ApiProperty()
  @IsInt()
  test: number
}
