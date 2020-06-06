import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  UseGuards,
  Body,
  Post,
  Request,
  Get,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { InvitesService } from './invites.service'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateManyInviteDto } from './dto/createManyInvite.dto'
import { Invite } from './invite.entity'
import { GroupsService } from '../groups/groups.service'
import { ActivateInviteDto } from './dto/activateInvite.dto'
import { TokensInterface } from '../auth/interfaces/tokens.interface'
import { FilterInvitesDto } from './dto/filterInvites.dto'

@ApiTags('invites')
@Controller('invites')
export class InvitesController {
  constructor(
    private readonly invitesService: InvitesService,
    private readonly groupsService: GroupsService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('many')
  async createMany(
    @Body() createManyInviteDto: CreateManyInviteDto,
    @Request() { user: { user } },
  ): Promise<Invite[]> {
    const group = await this.groupsService.findOne(createManyInviteDto.group)

    return await this.invitesService.createMany(
      createManyInviteDto.invites,
      group,
      user,
    )
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() filterInvitesDto: FilterInvitesDto,
    @Request() { user: { user } },
  ): Promise<Invite[]> {
    return await this.invitesService.findAll(
      user,
      filterInvitesDto.limit,
      filterInvitesDto.offset,
      filterInvitesDto.onlyUnused,
      filterInvitesDto.onlyOwn,
    )
  }

  @Post('activate')
  async activate(
    @Body() activateInviteDto: ActivateInviteDto,
  ): Promise<TokensInterface> {
    return await this.invitesService.activate(
      activateInviteDto.code,
      activateInviteDto.email,
      activateInviteDto.password,
    )
  }
}
