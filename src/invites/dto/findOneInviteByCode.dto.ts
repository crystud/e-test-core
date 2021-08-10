import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class FindOneInviteByCodeDto {
  @ApiProperty()
  @Type(() => String)
  code: string
}
