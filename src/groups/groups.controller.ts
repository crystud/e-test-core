import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { Roles } from '../auth/decorators/roles.decorator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateGroupDto } from './dto/createGroup.dto'

import { Group } from './group.entity'

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupsService.create(createGroupDto)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') groupId: number): Promise<Group> {
    return await this.groupsService.findOne(groupId)
  }
}
