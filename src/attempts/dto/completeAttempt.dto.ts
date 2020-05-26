import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class ResultAnswer {
  @ApiProperty({ type: [Number, String] })
  answers: number[] | string
}

export class CompleteAttemptDto {
  @ApiProperty({
    type: () => [ResultAnswer],
  })
  tasks: ResultAnswer[]

  @ApiProperty()
  @IsInt()
  attempt: number
}
