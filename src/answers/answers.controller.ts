import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('answers')
@Controller('answers')
export class AnswersController {}
