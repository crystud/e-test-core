import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty } from 'class-validator'

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  ask: string

  @ApiProperty()
  @IsNotEmpty()
  description: string

  @ApiProperty()
  @IsInt()
  topic: number
}
