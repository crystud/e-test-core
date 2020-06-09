import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

import { CreateAttemptDto } from './dto/createAttempt.dto'
import { AttemptsService } from './attempts.service'
import { TicketsService } from '../tickets/tickets.service'
import { Attempt } from './attempt.entity'
import { AttemptTask } from './attemptTask.entity'
import { CompleteAttemptDto } from './dto/completeAttempt.dto'

@ApiTags('attempts')
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

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.STUDENT)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':attemptId')
  async findOne(@Param('attemptId') attemptId: number): Promise<Attempt> {
    return await this.attemptsService.findOne(attemptId)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.STUDENT)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('attemptTasks/:attemptTaskId')
  async findAttemptTask(
    @Param('attemptTaskId') attemptTaskId: number,
  ): Promise<AttemptTask> {
    return await this.attemptsService.findAttemptTask(attemptTaskId)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.STUDENT)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('complete')
  async complete(
    @Body() completeAttemptDto: CompleteAttemptDto,
  ): Promise<Attempt> {
    const attempt = await this.attemptsService.findOne(
      completeAttemptDto.attempt,
    )

    return await this.attemptsService.complete(
      attempt,
      completeAttemptDto.tasks,
    )
  }
}
