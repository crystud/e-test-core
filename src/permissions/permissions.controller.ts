import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Permission } from './permission.entity'
import { CreatePermissionDto } from './dto/createPermission.dto'
import { PermissionsService } from './permissions.service'
import { TestsService } from '../tests/tests.service'
import { classToClass } from 'class-transformer'
import { AccessLevelType } from '../enums/accessLevelType'

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly testsService: TestsService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    type: Permission,
    description: 'Creates new permission.',
  })
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @Request() req,
  ): Promise<Permission> {
    const test = await this.testsService.findOne(createPermissionDto.testId)
    const user = req.user

    if (await this.testsService.hasAccess(test, user)) {
      const permission = await this.permissionsService.create(
        createPermissionDto,
        test,
        user,
      )

      return classToClass(permission, {
        groups: [...user.roles, AccessLevelType.OWNER],
      })
    }

    throw new ForbiddenException()
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    type: Permission,
    description: 'Find the permission by id.',
  })
  async findOne(
    @Param('id') permissionId: number,
    @Request() req,
  ): Promise<Permission> {
    const permission = await this.permissionsService.findOne(permissionId)

    return classToClass(permission, {
      groups: [...req.user.roles],
    })
  }
}
