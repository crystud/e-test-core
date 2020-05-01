import { ApiProperty } from '@nestjs/swagger'

class Task {
  @ApiProperty({ type: [Number] })
  answers: number[] | string
}

export class CompleteAttemptDto {
  @ApiProperty({
    type: () => [Task],
  })
  tasks: [
    {
      answers: number[] | string
    },
  ]
}
