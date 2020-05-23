import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import { UserRolesType } from '../../enums/userRolesType'
import { Transform } from 'class-transformer'

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
