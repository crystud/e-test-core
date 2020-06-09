import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateSubjectDto {
  @ApiProperty()
  @IsString()
  @Length(1, 50)
  @Type(() => String)
  name: string
}
