import {
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

import { TicketsService } from './tickets.service'
import { Ticket } from './ticket.entity'
import { classToClass } from 'class-transformer'
import { AccessLevelType } from '../enums/accessLevelType'

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

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':id/use')
  @ApiCreatedResponse({
    type: Ticket,
    description: 'Use ticket for starting testing',
  })
  async start(@Param('id') ticketId: number, @Request() req): Promise<Ticket> {
    let ticket = await this.ticketsService.findOne(ticketId)
    const user = req.user

    const accesses = await this.ticketsService.accessRelations(ticket, user)

    if (accesses.includes(AccessLevelType.STUDENT)) {
      ticket = await this.ticketsService.use(ticket)

      return classToClass(ticket, {
        groups: [...user.roles, ...accesses],
      })
    }

    throw new ForbiddenException()
  }
}
