import { ApiProperty } from '@nestjs/swagger'

export class FilterSubjectDto {
  @ApiProperty({ required: false })
  name?: string

  @ApiProperty({ required: false, default: 1 })
  confirmed?: number
}
