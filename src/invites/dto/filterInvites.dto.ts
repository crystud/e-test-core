import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, Min, Max, IsBoolean } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class FilterInvitesDto {
  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Min(0)
  @Max(40)
  @IsOptional()
  @Type(() => Number)
  limit = 40

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @ApiProperty({ type: Boolean, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(onlyOwn => onlyOwn === 'true')
  onlyUnused = false

  @ApiProperty({ type: Boolean, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(onlyOwn => onlyOwn === 'true')
  onlyOwn = false
}
