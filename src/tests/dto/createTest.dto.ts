import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString, Length } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTestDto {
  @ApiProperty()
  @IsString()
  @Length(1, 80)
  @Type(() => String)
  name: string

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  teacher: number
}
