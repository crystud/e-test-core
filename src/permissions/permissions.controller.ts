import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Permission } from './permission.entity'
import { TeachersService } from '../teachers/teachers.service'
import { PermissionsService } from './permissions.service'

import { CreatePermissionDto } from './dto/createPermission.dto'
import { TestsService } from '../tests/tests.service'
import { GroupsService } from '../groups/groups.service'
import { PermissionReportInterface } from './interfaces/permissionReport.interface'

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly teachersService: TeachersService,
    private readonly testsService: TestsService,
    private readonly groupsService: GroupsService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body()
    {
      group: groupId,
      test: testId,
      startTime,
      endTime,
      maxCountOfUse,
      resultSelectingMethod,
    }: CreatePermissionDto,
    @Request() { user: { user } },
  ): Promise<Permission> {
    const [group, test] = await Promise.all([
      this.groupsService.findEntity(groupId),
      this.testsService.findEntity(testId),
    ])

    if (
      group.speciality.subjects.some(subject => subject.id === test.subject.id)
    )
      throw new BadRequestException('Група не вивчає цей предмет')

    const teacher = await this.teachersService.findOneByUser(user, test.subject)

    return this.permissionsService.create(
      group,
      test,
      teacher,
      startTime,
      endTime,
      maxCountOfUse,
      resultSelectingMethod,
    )
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':permissionId')
  async findOne(
    @Param('permissionId') permissionId: number,
  ): Promise<Permission> {
    return await this.permissionsService.findOne(permissionId)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/findByTeacher/:teacherId')
  async findByTeacher(
    @Param('teacherId') teacherId: number,
  ): Promise<Permission[]> {
    return await this.permissionsService.findByTeacher(teacherId)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/:permissionId/report')
  async getReport(
    @Param('permissionId') permissionId: number,
  ): Promise<PermissionReportInterface> {
    // TODO: add access check
    return await this.permissionsService.getReport(permissionId)
  }
}
