import { ApiProperty } from '@nestjs/swagger'
import {IsBase64, IsOptional, Length} from 'class-validator'

export class SetAvatarDto {
  @ApiProperty({ required: false })
  @IsBase64()
  @Length(0, ((64 * 1024) / 3) * 4, {
    message: 'Максимальний розмір файлу 64KB',
  })
  @IsOptional()
  avatar: string = null
}
