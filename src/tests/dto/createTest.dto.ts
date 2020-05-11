import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString, Length, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTestDto {
  @ApiProperty()
  @IsString()
  @Length(1, 80)
  @Type(() => String)
  name: string

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(255)
  @Type(() => Number)
  countOfTasks: number

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  teacher: number
}
