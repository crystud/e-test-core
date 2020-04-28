import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {}
