import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Length, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class InviteData {
  @ApiProperty()
  @Length(2, 40)
  firstName: string

  @ApiProperty()
  @Length(2, 40)
  lastName: string

  @ApiProperty()
  @Length(2, 40)
  patronymic: string

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  scoringBook: number
}

export class CreateManyInviteDto {
  @ApiProperty({
    type: () => [InviteData],
  })
  invites: InviteData[]

  @ApiProperty()
  group: number
}
