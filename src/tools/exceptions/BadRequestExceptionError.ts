import { BadRequestException } from '@nestjs/common'

export interface BadRequestExceptionErrorInterface {
  value: any
  property: string
  constraints: object
}

export class BadRequestExceptionError extends BadRequestException {
  constructor(error: BadRequestExceptionErrorInterface) {
    super({
      statusCode: 400,
      error: 'Bad Request',
      message: [
        {
          value: error.value,
          property: error.property,
          children: [],
          constraints: error.constraints,
        },
      ],
    })
  }
}
