import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {}
