import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Group } from './group.entity'
import { CreateGroupDto } from './dto/createGroup.dto'
import { SpecialtiesService } from '../specialties/specialties.service'
import { CollegesService } from '../colleges/colleges.service'
import { UsersService } from '../users/users.service'
import { UserRolesType } from '../enums/userRolesType'

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly specialtiesService: SpecialtiesService,
    private readonly collegesService: CollegesService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Request() req,
  ): Promise<Group> {
    const speciality = await this.specialtiesService.findOne(
      createGroupDto.speciality,
    )

    const college = await this.collegesService.findOne(speciality.college.id)

    if (await this.collegesService.isEditor(college, req.user)) {
      return await this.groupsService.create(createGroupDto, speciality)
    }

    throw new ForbiddenException()
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') groupId: number, @Request() req): Promise<Group> {
    const group = await this.groupsService.findOne(groupId)

    const speciality = await this.specialtiesService.findOne(
      group.speciality.id,
    )

    const college = await this.collegesService.findOne(speciality.college.id)

    if (await this.collegesService.hasAccess(college, req.user)) return group

    throw new ForbiddenException()
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':group/student/:student')
  async addStudent(
    @Param('group') groupId: number,
    @Param('student') studentId: number,
    @Request() req,
  ): Promise<Group> {
    const group = await this.groupsService.findOne(groupId)
    const student = await this.usersService.findOne(studentId)

    const speciality = await this.specialtiesService.findOne(
      group.speciality.id,
    )

    const college = await this.collegesService.findOne(speciality.college.id)

    if (await this.collegesService.isEditor(college, req.user))
      return await this.groupsService.addStudent(group, student)

    throw new ForbiddenException()
  }
}
