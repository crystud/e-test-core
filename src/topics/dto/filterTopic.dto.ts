import { ApiProperty } from '@nestjs/swagger'

export class FilterTopicDto {
  @ApiProperty({ required: false })
  name?: string

  @ApiProperty({ required: false, default: 1 })
  confirmed?: number

  @ApiProperty({ required: false, default: 1 })
  subject?: number
}
