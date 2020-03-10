import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class RefreshTokenDto {
  @ApiProperty()
  @IsUUID()
  token: string
}
