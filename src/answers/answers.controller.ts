import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Answer } from './answer.entity'
import { CreateAnswerDto } from './dto/createAnswer.dto'
import { AnswersService } from './answers.service'
import { TasksService } from '../tasks/tasks.service'
import { classToClass } from 'class-transformer'
import { TaskTypes } from '../enums/TaskTypes.enum'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(
    private readonly answersService: AnswersService,
    private readonly tasksService: TasksService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    type: Answer,
    description: 'Creates new answer.',
  })
  async create(
    @Body() createAnswerDto: CreateAnswerDto,
    @Request() req,
  ): Promise<Answer> {
    const task = await this.tasksService.findOne(createAnswerDto.task)

    // TODO: refactor
    if (
      task.type === TaskTypes.NUMBERING &&
      task.answers.some(answer => answer.position === createAnswerDto.position)
    ) {
      throw new BadRequestExceptionError({
        property: 'position',
        value: createAnswerDto.position,
        constraints: {
          isNotExist: 'Position is alread used',
        },
      })
    }

    const answer = await this.answersService.create(createAnswerDto, task)

    return classToClass(answer, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiCreatedResponse({
    type: Answer,
    description: 'Find the answer by id.',
  })
  async findOne(
    @Param('id') answerId: number,
    @Request() req,
  ): Promise<Answer> {
    const answer = await this.answersService.findOne(answerId)

    return classToClass(answer, {
      groups: [...req.user.roles],
    })
  }
}
