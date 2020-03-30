import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('tests')
@Controller('tests')
export class TestsController {}
