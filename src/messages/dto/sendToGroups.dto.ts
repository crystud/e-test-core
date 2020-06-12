import { ApiProperty } from '@nestjs/swagger'
import { Length, IsInt } from 'class-validator'

export class SendToGroupsDto {
  @ApiProperty()
  @Length(1, 512)
  messageText: string

  @ApiProperty({ type: [Number] })
  @IsInt({ each: true })
  groups: number[]
}
