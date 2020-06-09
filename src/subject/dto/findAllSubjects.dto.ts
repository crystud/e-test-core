import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class FindAllSubjectsDto {
  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  name = ''

  @ApiProperty({ required: false, type: [Number] })
  @IsInt({ each: true })
  @IsOptional()
  @Transform(specialties =>
    Array.isArray(specialties) ? specialties : [specialties],
  )
  @Type(() => Number)
  specialties = []
}
