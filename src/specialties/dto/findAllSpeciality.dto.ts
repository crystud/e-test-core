import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class FindAllSpecialityDto {
  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  name = ''

  @ApiProperty({ required: false, type: Number })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  subject: number
}
