import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class FindAllSpecialityDto {
  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  name = ''
}
