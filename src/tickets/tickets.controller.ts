import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Permission } from '../permissions/permission.entity'
import { TicketsService } from './tickets.service'
import { Ticket } from './ticket.entity'
import { classToClass } from 'class-transformer'

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    type: Ticket,
    description: 'Find the ticket by id.',
  })
  async findOne(
    @Param('id') ticketId: number,
    @Request() req,
  ): Promise<Ticket> {
    const ticket = await this.ticketsService.findOne(ticketId)

    const accesses = await this.ticketsService.accessRelations(ticket, req.user)

    return classToClass(ticket, {
      groups: [...req.user.roles, ...accesses],
    })
  }
}
