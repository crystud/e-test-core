import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { InvitesService } from './invites.service'

@ApiTags('invites')
@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}
  /*
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createInviteDto: CreateInviteDto): Promise<Invite> {
    return await this.invitesService.create()
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('many')
  async createMany(@Body() createGroupDto: CreateGroupDto): Promise<Invite[]> {
    return await this.invitesService.createMany(createGroupDto)
  }*/
}
