import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {}
