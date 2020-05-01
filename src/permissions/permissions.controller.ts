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
import { GroupsService } from '../groups/groups.service'
import { TicketsService } from '../tickets/tickets.service'
import { StudiesService } from '../studies/studies.service'

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly testsService: TestsService,
    private readonly groupsService: GroupsService,
    private readonly ticketsService: TicketsService,
    private readonly studiesService: StudiesService,
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
    const [test, groups, study] = await Promise.all([
      this.testsService.findOne(createPermissionDto.testId),
      this.groupsService.findByIds(createPermissionDto.groups),
      this.studiesService.findOne(createPermissionDto.study),
    ])

    const user = req.user

    if (await this.testsService.hasAccess(test, user)) {
      let permission = await this.permissionsService.create(
        createPermissionDto,
        test,
        user,
        groups,
        study,
      )

      let users = []
      groups.forEach(group => (users = [...users, ...group.students]))

      await this.ticketsService.createMany(
        `${permission.test.title} (${permission.allower.fullName})`,
        permission,
        users,
      )

      permission = await this.permissionsService.findOne(permission.id)

      return classToClass(permission, {
        groups: [...user.roles, AccessLevelType.ALLOWER],
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

    const accesses = await this.permissionsService.accessRelations(
      permission,
      req.user,
    )

    return classToClass(permission, {
      groups: [...req.user.roles, ...accesses],
    })
  }
}
