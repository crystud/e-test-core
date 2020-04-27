import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsEnum } from 'class-validator'
import { TaskTypes } from '../../enums/TaskTypes.enum'

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  ask: string

  @ApiProperty()
  @IsNotEmpty()
  description: string

  @ApiProperty({ enum: TaskTypes })
  @IsEnum(TaskTypes)
  type: TaskTypes

  @ApiProperty({ required: false })
  ignoreCase?: boolean

  @ApiProperty()
  @IsInt()
  topic: number
}
