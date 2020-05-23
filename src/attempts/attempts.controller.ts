import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

import { CreateAttemptDto } from './dto/createAttempt.dto'
import { AttemptsService } from './attempts.service'
import { TicketsService } from '../tickets/tickets.service'
import { Attempt } from './attempt.entity'

@Controller('attempts')
export class AttemptsController {
  constructor(
    private readonly attemptsService: AttemptsService,
    private readonly ticketsService: TicketsService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.STUDENT)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAttemptDto: CreateAttemptDto): Promise<Attempt> {
    const ticket = await this.ticketsService.findEntity(createAttemptDto.ticket)

    return await this.attemptsService.create(ticket)
  }
}
