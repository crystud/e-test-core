import { ApiProperty } from '@nestjs/swagger'

export class FilterCollegeDto {
  @ApiProperty({ required: false })
  name?: string

  @ApiProperty({ required: false })
  address?: string

  @ApiProperty({ required: false })
  site?: string

  @ApiProperty({ required: false })
  EDBO?: number

  @ApiProperty({ required: false, default: 1 })
  confirmed?: number

  @ApiProperty({ required: false })
  creator?: number
}
