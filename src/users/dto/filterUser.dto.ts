import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { UserRolesType } from '../../enums/userRolesType'
import { Transform, Type } from 'class-transformer'

export class FilterUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  patronymic?: string

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

  @ApiProperty({
    isArray: true,
    type: [UserRolesType],
    required: false,
  })
  @IsEnum(UserRolesType, { each: true })
  @IsArray()
  @IsOptional()
  @Transform(roles => (Array.isArray(roles) ? roles : [roles]))
  roles: UserRolesType[] = []

  @ApiProperty({
    isArray: true,
    type: [UserRolesType],
    required: false,
  })
  @IsEnum(UserRolesType, { each: true })
  @IsOptional()
  @Transform(roles => (Array.isArray(roles) ? roles : [roles]))
  isNotInRoles: UserRolesType[] = []
}
