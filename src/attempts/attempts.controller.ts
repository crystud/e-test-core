import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AttemptsService } from './attempts.service'
import { Attempt } from './attempt.entity'
import { classToClass } from 'class-transformer'
import { AttemptAnswer } from './attemptAnswer.entity'
import { AttemptTask } from './attemptTask.entity'

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    type: Attempt,
    description: 'Find the attempt by id.',
  })
  async findOne(
    @Param('id') attemptId: number,
    @Request() req,
  ): Promise<Attempt> {
    const attempt = await this.attemptsService.findOne(attemptId)
    const user = req.user
    const accesses = await this.attemptsService.accessRelations(attempt, user)

    return classToClass(attempt, {
      groups: [...user.roles, ...accesses],
    })
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id/tasks')
  @ApiOkResponse({
    type: [AttemptTask],
    description: 'Find tasks list by attempt id',
  })
  async findTasks(@Param('id') attemptId: number): Promise<AttemptTask[]> {
    const attempt = await this.attemptsService.findOne(attemptId)

    return await this.attemptsService.findTasks(attempt)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':attemptId/tasks/:taskId/answers')
  @ApiOkResponse({
    type: [AttemptAnswer],
    description: 'Find answers list by task id',
  })
  async findAnswers(
    @Param('attemptId') attemptId: number,
    @Param('taskId') taskId: number,
  ): Promise<AttemptAnswer[]> {
    const attemptTask = await this.attemptsService.findTask(taskId)

    return await this.attemptsService.findAnswers(attemptTask)
  }
}
