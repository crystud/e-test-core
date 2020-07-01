import { ApiProperty } from '@nestjs/swagger'
import { IsBase64, IsInt, IsOptional, Length, Min } from 'class-validator'
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

  @ApiProperty({ required: false })
  @IsBase64()
  @Length(0, ((64 * 1024) / 3) * 4, {
    message: 'Максимальний розмір файлу 64KB',
  })
  @IsOptional()
  avatar: string = null
}

export class CreateManyInviteDto {
  @ApiProperty({
    type: () => [InviteData],
  })
  invites: InviteData[]

  @ApiProperty()
  group: number
}
