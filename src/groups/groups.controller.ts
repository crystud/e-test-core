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
import { UserRolesType } from '../users/user.entity'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Group } from './group.entity'
import { CreateGroupDto } from './dto/createGroup.dto'
import { SpecialtiesService } from '../specialties/specialties.service'
import { CollegesService } from '../colleges/colleges.service'

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly specialtiesService: SpecialtiesService,
    private readonly collegesService: CollegesService,
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

    if (await this.collegesService.isEditor(speciality.college, req.user)) {
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

    if (await this.collegesService.hasAccess(speciality.college, req.user))
      return group

    throw new ForbiddenException()
  }
}
