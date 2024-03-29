import { ApiProperty } from '@nestjs/swagger'
import {
  IsBase64,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { TaskType } from '../enums/TaskType.enum'

export class CreateTaskDto {
  @ApiProperty()
  @Length(1, 255)
  @Type(() => String)
  question: string

  @ApiProperty({ required: false })
  @IsBase64()
  @Length(0, ((512 * 1024) / 3) * 4, {
    message: 'Максимальний розмір файлу 512KB',
  })
  @IsOptional()
  image: string = null

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  topic: number

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  attachment: string

  @ApiProperty({ enum: Object.keys(TaskType).filter(x => !(parseInt(x) >= 0)) })
  @IsEnum(TaskType)
  @Transform(type => TaskType[type])
  type: TaskType
}
