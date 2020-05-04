import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AttemptsService } from './attempts.service'
import { Attempt } from './attempt.entity'
import { classToClass } from 'class-transformer'
import { AttemptAnswer } from './attemptAnswer.entity'
import { AttemptTask } from './attemptTask.entity'
import { CompleteAttemptDto } from './dto/completeAttempt.dto'
import { Result } from '../results/result.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'

@ApiTags('attempts')
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

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':attemptId/complete')
  @ApiOkResponse({
    type: Result,
    description: 'Complete attempt and make result',
  })
  async complete(
    @Param('attemptId') attemptId: number,
    @Body() completeAttemptDto: CompleteAttemptDto,
    @Request() req,
  ): Promise<Result> {
    const attempt = await this.attemptsService.findOne(attemptId)

    if (attempt.result) {
      throw new BadRequestExceptionError({
        value: attemptId,
        property: 'attemptId',
        constraints: {
          alreadyEnded: 'This attempt already complete',
        },
      })
    }

    const result = await this.attemptsService.complete(
      completeAttemptDto,
      attempt,
    )

    return classToClass(result, {
      groups: [...req.user.roles],
    })
  }
}
