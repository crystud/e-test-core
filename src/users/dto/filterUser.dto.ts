import { ApiProperty } from '@nestjs/swagger'

export class FilterUserDto {
  @ApiProperty({ required: false })
  firstName?: string

  @ApiProperty({ required: false })
  lastName?: string

  @ApiProperty({ required: false })
  patronymic?: string
}
