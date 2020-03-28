import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../users/user.entity'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Group } from './group.entity'
import { CreateGroupDto } from './dto/createGroup.dto'
import { SpecialitysService } from '../specialties/specialties.service'
import { CollegesService } from '../colleges/colleges.service'

@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly specialitysService: SpecialitysService,
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
    const speciality = await this.specialitysService.findOne(
      createGroupDto.speciality,
    )

    if (await this.collegesService.isEditor(speciality.college, req.user)) {
      return await this.groupsService.create(createGroupDto, speciality)
    }

    throw new ForbiddenException()
  }
}
