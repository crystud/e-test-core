import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('messages')
@Controller('messages')
export class MessagesController {}
